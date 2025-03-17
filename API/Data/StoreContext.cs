using API.Entities;
using API.Entities.OrderAggregate;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data 
{
    //public class StoreContext(DbContextOptions options) : DbContext(options)
    public class StoreContext(DbContextOptions options) : IdentityDbContext<User>(options)
    {
        public required DbSet<Product> Products{ get; set;}
        public required DbSet<Basket> Baskets {get; set;}
        public required DbSet<Order> Orders {get;set;}
    protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<IdentityRole>().HasData(
                new IdentityRole {Id = "db12603c-db66-4ded-9a75-ced6e5c520d8", Name = "Member", NormalizedName = "MEMBER"},
                new IdentityRole {Id = "36ab3f0b-f7a8-4159-96d2-b658807bd344", Name = "Admin", NormalizedName = "ADMIN"}
            );
        }
    }
}