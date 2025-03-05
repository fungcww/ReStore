using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Extentions
{
    public static class BasketExtensions
    {
        public static BasketDto ToDto(this Basket basket)//define which class to use this static method
        {
            return new BasketDto
            {
                BasketId = basket.Id,
                BuyerId = basket.BuyerId,
                ClientSecret = basket.ClientSecret,
                //PaymentIntentId = basket.PaymentIntentId,
                Items = basket.Items.Select(item => new BasketItemDto
                {
                    ProductId = item.ProductId,
                    Name = item.Product.Name,
                    Price = item.Product.Price,
                    PictureUrl = item.Product.PictureUrl,
                    Type = item.Product.Type,
                    Brand = item.Product.Brand,
                    Quantity = item.Quantity
                }).ToList()
            };
        }
        public static async Task<Basket> GetBasketWithItems(this IQueryable<Basket> query,
            string? basketId)
        {
            return await query
                .Include(x => x.Items)
                .ThenInclude(x => x.Product)
                .FirstOrDefaultAsync(x => x.BuyerId == basketId) ??
                throw new Exception("Cannot get basket");
        }
    }
}