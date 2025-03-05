using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using Stripe;

namespace API.Services
{
    public class PaymentsService(IConfiguration config)
    {
     public async Task<PaymentIntent> CreateOrUpdatePaymentIntent(Basket basket)
     {
        StripeConfiguration.ApiKey = config["StripeSettings:SecretKey"];

        var service = new PaymentIntentService();

        var intent = new PaymentIntent();
        var subtotal = basket.Items.Sum(item => item.Product.Price * item.Quantity);
        var deliveryFee = subtotal > 10000 ? 0 : 500;
        if(string.IsNullOrWhiteSpace(basket.PaymentIntentId))
        //it's new payment
        {
            var options = new PaymentIntentCreateOptions
            {
                Amount = subtotal + deliveryFee,
                Currency = "usd",
                PaymentMethodTypes = new List<string> {"card"}
            };
            intent = await service.CreateAsync(options);
        }
        else
        {
            var options = new PaymentIntentUpdateOptions
            {
                Amount = subtotal + deliveryFee
            };
            intent = await service.UpdateAsync(basket.PaymentIntentId, options);
            return intent;
        }
        return intent;
     }
    }
}