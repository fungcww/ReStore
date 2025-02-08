using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using API.Extentions;
using API.RequestHelpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;

namespace API.controller
{
    public class ProductsController : BaseApiController
    {
        private readonly StoreContext _context;
        public ProductsController(StoreContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<Product>>> GetProducts(
            [FromQuery]ProductParams productParams)//get data from query string
        {
            var query = _context.Products
            .Sort(productParams.OrderBy)
            .Search(productParams.SearchTerm)
            .Filter(productParams.Brands, productParams.Types)
            .AsQueryable();
            
            var products = await PagedList<Product>.ToPagedList(query,
                productParams.PageNumber, productParams.PageSize);
            
            Response.AddPaginationHeader(products.Metadata);
            //only get data when running below line, above is stored in memory
            //return await query.ToListAsync();// change to use deferred excution
            return products;
        }
        [HttpGet("{id:int}")] //{id} -> route template
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if(product == null) return NotFound();
            return product;
        }
        [HttpGet("{filters}")]
        public async Task<IActionResult> GetFilters()
        {
            var brands = await _context.Products.Select(x => x.Brand).Distinct().ToListAsync();
            var types = await _context.Products.Select(x => x.Type).Distinct().ToListAsync();

            return Ok(new {brands, types});
        }
    }
}