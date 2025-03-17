using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace API.Entities.OrderAggregate
{
    [Owned]
    public class ShippingAddress
    {
    public required string Name { get; set; }
    public required string Line1 { get; set; }
    public string? Line2 { get; set; }
    public required string City { get; set; }
    public required string State { get; set; }
    [JsonPropertyName("postal_code")]
    //json serialization property name is case sensitive
    public string Postalcode { get; set; }
    public string Country { get; set; }
    }
}