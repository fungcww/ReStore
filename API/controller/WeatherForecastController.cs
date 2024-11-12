using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace API.controller
{
    [ApiController]
    [Route("controller")]
    public class WeatherForecastController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetProducts()
        {
            string products = "test";
            return Ok(products);
        }
    }
}