using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace API.Middleware;
public class ExceptionMiddleware(IHostEnvironment env, ILogger<ExceptionMiddleware> logger) : IMiddleware
{
    readonly RequestDelegate _next;
    readonly ILogger _logger;
    // readonly IHostEnvironment _env;
    // public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger,
    // IHostEnvironment env)
    // {
    //     _next = next;
    //     _logger = logger;
    //     _env = env;
    // }

    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            // _logger.LogError(ex, ex.Message);
            // context.Response.ContentType = "application/json";
            // context.Response.StatusCode = 500;

            // var response = new ProblemDetails
            // {
            //     Status = 500,
            //     Detail = _env.IsDevelopment() ? ex.StackTrace?.ToString() : null,
            //     Title = ex.Message
            // };
            // var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

            // var json = JsonSerializer.Serialize(response, options);

            // await context.Response.WriteAsync(json);
        }
    }
    private async Task HandleException(HttpContext context, Exception ex)
    {
        logger.LogError(ex, ex.Message);
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = 500;

        var response = new ProblemDetails
        {
                Status = 500,
                Detail = env.IsDevelopment() ? ex.StackTrace?.ToString() : null,
                Title = ex.Message
        };
        
        var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

        var json = JsonSerializer.Serialize(response, options);

        await context.Response.WriteAsync(json);
    }
}