using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities.OrderAggregate;
using Stripe;

namespace API.DTOs
{
    public class CreateOrderDto
    {
        public ShippingAddress ShippingAddress {get;set;}
        public PaymentSummary PaymentSummary {get;set;}
    }
}