using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Threading.Tasks;

namespace API.Entities
{
    public class Basket
    {
        public int Id {get; set;}
        public string BuyerId {get; set;}
        public List<BasketItem> Items {get;set;} = new();
        public string? ClientSecret {get; set;}
        //after sending payment to stripe, we will get a client secret
        //this client secret will be used to confirm the payment
        public string? PaymentIntentId {get; set;}
        //this is the id of the payment intent that we will create in stripe
        //this will be used to track the payment intent
        //when user make some updates to the basket, we will need to update the payment intent
        public void AddItem(Product product, int quantity)
        {
            if(Items.All(item => item.ProductId != product.Id))
            {
                if (product == null) ArgumentNullException.ThrowIfNull(product);
                if(quantity <= 0) throw new ArgumentException("Quauntitty should be greater thhan zero", nameof(quantity));
            }

            var existingItem = FindItem(product.Id);
            if(existingItem == null)
            {
                Items.Add(new BasketItem
                {
                    Product = product, 
                    Quantity = quantity
                });
            }
            else
            {
                existingItem.Quantity += quantity;
            }
        }
        public BasketItem? FindItem(int productId)
        {
            return Items.FirstOrDefault(item => item.ProductId == productId);
        }
        public void RemoveItem(int productId, int quantity)
        {
            if(quantity <= 0) throw new ArgumentException("Quantity should be greater than zero",
            nameof(quantity));

            var item = FindItem(productId);
            if(item == null) return;
            item.Quantity -= quantity;
            if(item.Quantity <=  0) Items.Remove(item);
        }
    }
}