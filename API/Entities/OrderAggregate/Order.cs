using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Stripe;

namespace API.Entities.OrderAggregate
{
    public class Order
    {
        public int Id {get;set;}
        public string BuyerEmail {get;set;}
        public ShippingAddress ShippingAddress {get;set;}
        public DateTime OrderDate {get;set;} = DateTime.UtcNow;
        public List<OrderItem> OrderItems {get;set;} = [];
        public long Subtotal {get;set;}
        public long DeliveryFee {get;set;}
        public long Discount {get;set;}
        public long Total {get;set;}
        public string PaymentIntentId {get;set;}
        // check in db if it's updated to be not nullable
        public OrderStatus OrderStatus {get;set;} = OrderStatus.Pending;
        public required PaymentSummary PaymentSummary {get;set;}

        public long GetTotal()
        {
            return Subtotal + DeliveryFee - Discount;
        }
    }
}