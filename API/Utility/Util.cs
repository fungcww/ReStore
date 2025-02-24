using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.DataProtection;

namespace API.Utility
{
    public static class Util
    {
        public static ClaimsPrincipal CreatePrincipal(User user)
        {
            // Create the claims for the user
            var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
            // Add more claims as needed, such as roles
        };

            // Create the ClaimsIdentity
            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

            // Create and return the ClaimsPrincipal
            return new ClaimsPrincipal(identity);
        }
        public static string ProtectPrincipal(ClaimsPrincipal principal, IDataProtector dataProtector)
        {
            var ticket = new AuthenticationTicket(principal, new AuthenticationProperties(), CookieAuthenticationDefaults.AuthenticationScheme);
            var ticketDataFormat = new TicketDataFormat(dataProtector);
            return ticketDataFormat.Protect(ticket);
        }
    }
}