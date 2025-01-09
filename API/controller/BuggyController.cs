using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace API.controller
{
    public class BuggyController : BaseApiController
    {
        [HttpGet("not-found!!!")]
        public ActionResult GetNotFound()
        {
            return NotFound();
        }
        [HttpGet("bad-request")]
        public ActionResult GetBadRequest()
        {
            //return BadRequest("This is a bad request");
            return BadRequest(new ProblemDetails{Title="This is a bad request"});
            //create a proble detail object instead of a string
        }
        [HttpGet("unauthorised")]
        public ActionResult GetUnauthorized()
        {
            return Unauthorized();
        }
        [HttpGet("validation-error")]
        public ActionResult GetValidationError()
        {
            ModelState.AddModelError("Problem1", "This is the first error");//key value
            ModelState.AddModelError("Problem2", "This is the second error");
            return ValidationProblem();//return this object include error status 400 and ModelState object 
        }
        [HttpGet("server-error")]
        public ActionResult GetServerError()
        {
            throw new Exception("This is a server error (exception)");
        }
    }

}