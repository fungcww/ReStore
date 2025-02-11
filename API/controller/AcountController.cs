using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.controller
{
    public class AccountController(SignInManager<User> signInManager) : BaseApiController
    {
        [HttpPost("register")]
        public async Task<ActionResult> RegisterUser(RegisterDto registerDto)
        {
            var user = new User
            {
                UserName = registerDto.Email,
                Email = registerDto.Email
            };
            var result = await signInManager.UserManager.CreateAsync(user, registerDto.Password);

            if(!result.Succeeded)
            {
                foreach(var error in result.Errors)
                {
                    ModelState.AddModelError(error.Code, error.Description);
                }
                return ValidationProblem();
            }
            await signInManager.UserManager.AddToRoleAsync(user, "Member");
            return Ok();
        }
        [HttpGet("user-info")]
        public async Task<ActionResult> GetUserInfo()
        {
            if(User.Identity.IsAuthenticated)
            {
                var user = await signInManager.UserManager.GetUserAsync(User);
                if(user == null)
                {
                    return Unauthorized();
                }
                var roles = await signInManager.UserManager.GetRolesAsync(user);
                return Ok(new {user.Email, user.UserName, Roles = roles});
            }
            else
            {
                return NoContent();
            }
        }
        [HttpPost("logout")]
        public async Task<ActionResult> Logout()
        {
            await signInManager.SignOutAsync();
            return NoContent();
        }
    }        
}