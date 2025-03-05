using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Extentions;
using API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace API.controller
{
    //[Route("[controller]")]
    public class PaymentsController(PaymentsService paymentsService, StoreContext context) : BaseApiController
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
    }
}