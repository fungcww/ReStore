using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs; // Ensure this namespace contains the LoginDto class
using API.Entities;
using API.Utility;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.controller
{
    //public class AccountController(SignInManager<User> signInManager) : BaseApiController
    public class AccountController : BaseApiController
    {
        private readonly SignInManager<User> _signInManager;
        private readonly IAuthenticationService _authenticationService;
        private readonly IDataProtector _dataProtector;

        public AccountController(SignInManager<User> signInManager,
         IAuthenticationService authenticationService,
         IDataProtectionProvider dataProtectionProvider)
        {
            _signInManager = signInManager;
            _authenticationService = authenticationService;
            _dataProtector = dataProtectionProvider.CreateProtector("Microsoft.AspNetCore.Authentication.Cookies.CookieAuthenticationMiddleware",
            "Cookies",
            "v2");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            //wai2@test.com
            //Pa$$w0rd
            try
            {
                var result = await _signInManager.PasswordSignInAsync(loginDto.Email, loginDto.Password, false, false);
                if (result.Succeeded)
                {
                    // Append the authentication cookie to the response
                    // var cookieOptions = new CookieOptions
                    // {
                    //     HttpOnly = true,
                    //     Secure = true, // Ensure this matches your deployment setup (use HTTPS)
                    //     SameSite = SameSiteMode.None // Adjust as needed
                    // };
                    // Retrieve the user
                    var user = await _signInManager.UserManager.FindByEmailAsync(loginDto.Email);
                    if (user == null)
                    {
                        return Unauthorized("Invalid login attempt.");
                    }
                    // Generate a token (this is an example, replace with your actual token generation logic)
                    //var token = await _signInManager.UserManager.GenerateUserTokenAsync(user, "Default", "access_token");
                    //var claimsPrincipal = Util.CreatePrincipal(user);
                    //var token = Request.Cookies[".AspNetCore.Identity.Application"];
                    //var protectedTicket = Util.ProtectPrincipal(claimsPrincipal, _dataProtector);
                    var cookieOptions = new CookieOptions
                    {
                        HttpOnly = true,
                        Secure = true, // Set to true if using HTTPS
                        SameSite = SameSiteMode.None // Adjust as needed
                    };
                    //Response.Cookies.Append(".AspNetCore.Identity.Application", protectedTicket, cookieOptions);

                    return Ok(new { message = "Login successful" });
                }
                return Unauthorized(new { message = "Login failed" });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("register")]
        public async Task<ActionResult> RegisterUser(RegisterDto registerDto)
        {
            var user = new User
            {
                UserName = registerDto.Email,
                Email = registerDto.Email
            };
            var result = await _signInManager.UserManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(error.Code, error.Description);
                }
                return ValidationProblem();
            }
            await _signInManager.UserManager.AddToRoleAsync(user, "Member");
            return Ok();
        }

        [HttpGet("user-info")]
        public async Task<ActionResult> GetUserInfo()
        {
            //var cookieName = ".AspNetCore.Identity.Application";
            if (!Request.Cookies.TryGetValue(".AspNetCore.Identity.Application", out var cookieValue))
            {
                return NoContent();
            }
            var ticketDataFormat = new TicketDataFormat(_dataProtector);
            var ticket = ticketDataFormat.Unprotect(cookieValue);
            if (ticket == null)
            {
                //return Unauthorized(new { message = "Invalid authentication cookie" });
            }

            //var authResult = await _authenticationService.AuthenticateAsync(HttpContext, cookieName);
            //var test = await _signInManager.UserManager.
            //var user_test = await _signInManager.UserManager.GetUserAsync(ticket.Principal);
            if (User.Identity.IsAuthenticated)
            {
                var user = await _signInManager.UserManager.GetUserAsync(User);
                if (user == null)
                {
                    //return Unauthorized();
                }
                var roles = await _signInManager.UserManager.GetRolesAsync(user);
                //return Ok(new { userDto });
                return Ok(new { user.Email, user.UserName, Roles = roles });
            }
            else
            {
                return NoContent();
            }
        }
        [HttpPost("logout")]
        public async Task<ActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return NoContent();
        }
        //[Authorize]
        [HttpPost("address")]
        public async Task<ActionResult> AddAddress(Address address)
        {
            var user = await _signInManager.UserManager.Users
                .Include(x => x.Address)
                .FirstOrDefaultAsync(x => x.UserName == User.Identity!.Name);
            //-> ! return null is nth
            if (user == null)
            {
                return Unauthorized();
            }
            user.Address = address;
            var result = await _signInManager.UserManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest("Problem updating the user's address");
            }
            return Ok(user.Address);
        }
        //[Authorize]
        [HttpGet("address")]
        public async Task<ActionResult<Address>> GetSavedAddress()
        {
            var address = await _signInManager.UserManager.Users
                .Where(x => x.UserName == User.Identity!.Name)
                .Select(x => x.Address)
                .FirstOrDefaultAsync();

            if (address == null)
            {
                var newAddress = new Address
                {
                    Name = string.Empty,
                    Line1 = string.Empty,
                    City = string.Empty,
                    State = string.Empty
                };
                return newAddress;
            }
            return address;
        }
    }
}