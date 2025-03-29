using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities.OrderAggregate;
using API.Extentions;
using API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Stripe;

namespace API.controller
{
    //[Route("[controller]")]
    public class PaymentsController(PaymentsService paymentsService, 
    StoreContext context, IConfiguration config, ILogger<PaymentsController> logger) 
        : BaseApiController
    {
        [HttpPost]
        public async Task<ActionResult<BasketDto>> CreateOrUpdatePaymentIntent()
        {
            var basket = await context.Baskets.GetBasketWithItems(Request.Cookies["buyerId"]);
            if (basket == null)
            {
                return BadRequest(new ProblemDetails { Title = "Cannot get basket" });
            }
            var intent = await paymentsService.CreateOrUpdatePaymentIntent(basket);
            if (intent == null)
            {
                return BadRequest(new ProblemDetails { Title = "Cannot create payment intent" });
            }

            basket.PaymentIntentId ??= intent.Id;
            basket.ClientSecret ??= intent.ClientSecret;

            if (context.ChangeTracker.HasChanges())
            {
                var result = await context.SaveChangesAsync() > 0;
                if (!result) return BadRequest(new ProblemDetails { Title = "Problem updating basket with intent" });
            }

            return basket.ToDto();
        }
        [HttpPost("webhook")]
        public async Task<IActionResult> StripeWebHook()
        {
            var json = await new StreamReader(Request.Body).ReadToEndAsync();

            try
            {
                var stripeEvent = ConstructStripeEvent(json);

                if(stripeEvent.Data.Object is not PaymentIntent intent)
                {
                    return BadRequest("Intent not found");
                }

                if(intent.Status == "succeeded") await HandlePaymentIntentSucceeded(intent);
                else await HandlePaymentIntentFailed(intent);

                return Ok();
            }
            catch (StripeException ex)
            {
                logger.LogError(ex, "Stripe Webhook error");
                return StatusCode(StatusCodes.Status500InternalServerError, "Stripe Webhook error");
            }
            catch(Exception ex)//catch all other exceptions
            {
                logger.LogError(ex, "Webhook related Error");
                return StatusCode(StatusCodes.Status500InternalServerError, "Unexpected error");
            }
        }

        private async Task HandlePaymentIntentFailed(PaymentIntent intent)
        {
            var order = await context.Orders
                .Include(x => x.OrderItems)
                .FirstOrDefaultAsync(x => x.PaymentIntentId == intent.Id) 
                ?? throw new Exception("Order not found");
                
            foreach (var item in order.OrderItems)
            {
                var productItem = await context.Products
                    .FindAsync(item.ItemOrdered.ProductId) 
                    ?? throw new Exception("Problem updating order stock");
                
                productItem.QuantityInStock += item.Quantity;
            }
            order.OrderStatus = OrderStatus.PaymentFailed;

            await context.SaveChangesAsync();
        }

        private async Task HandlePaymentIntentSucceeded(PaymentIntent intent)
        {
            var order = await context.Orders
                .Include(x => x.OrderItems)
                .FirstOrDefaultAsync(x => x.PaymentIntentId == intent.Id) 
                ?? throw new Exception("Order not found");

            if(order.GetTotal() != intent.Amount)
            {
                order.OrderStatus = OrderStatus.PaymentMismatch;
            }
            else
            {
                order.OrderStatus = OrderStatus.PaymentReceived;
            }
            var basket = await context.Baskets.FirstOrDefaultAsync(x => 
                x.PaymentIntentId == intent.Id);
            
            if(basket != null)
            {
                context.Baskets.Remove(basket);
            }
            
            await context.SaveChangesAsync();
        }

        private Event ConstructStripeEvent(string json)
        {
            try
            {
                return EventUtility.ConstructEvent(json,
                    Request.Headers["Stripe-Signature"], config["StripeSettings:WhSecret"]);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error processing stripe webhook");
                throw new StripeException($"Error deserializing stripe event: {ex.Message}");
            }
        }
    }
}