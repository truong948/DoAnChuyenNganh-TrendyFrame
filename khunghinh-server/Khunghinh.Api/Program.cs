using Khunghinh.Api.Data.Entities;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ========== Database ==========
builder.Services.AddDbContext<KhunghinhContext>(opt =>
    opt.UseSqlServer(builder.Configuration.GetConnectionString("Default")));

// ========== CORS ==========
builder.Services.AddCors(opt =>
{
    opt.AddPolicy("spa", p => p
        .WithOrigins("http://localhost:5173", "http://localhost:3000")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials());
});

// ========== Controllers & Swagger ==========
builder.Services.AddControllers()
    .AddJsonOptions(o =>
    {
        o.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        o.JsonSerializerOptions.WriteIndented = false;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ========== Authentication Google ==========
builder.Services.AddAuthentication("Cookies")
    .AddCookie("Cookies", o =>
    {
        o.SlidingExpiration = true;
        o.Cookie.SameSite = SameSiteMode.None;
        o.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    })
    .AddGoogle("Google", o =>
    {
        o.ClientId = builder.Configuration["Auth:Google:ClientId"]!;
        o.ClientSecret = builder.Configuration["Auth:Google:ClientSecret"]!;
        o.SaveTokens = true;
        o.ClaimActions.MapJsonKey("picture", "picture", "url"); // đảm bảo có claim 'picture'
    });

builder.Services.AddAuthorization();

var app = builder.Build();

// ========== Middleware ==========
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("spa");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// demo endpoint (giữ cho nhanh)
var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

app.Run();

// ===== đặt record ở cuối file, KHÔNG bọc namespace =====
public record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
