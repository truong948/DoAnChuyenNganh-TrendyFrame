using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace Khunghinh.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        private readonly string _spaOrigin;

        public AuthController(IConfiguration cfg)
        {
            // cấu hình trong appsettings: "FrontendOrigin": "http://localhost:5173"
            _spaOrigin = cfg["FrontendOrigin"] ?? "http://localhost:5173";
        }

        // Bước 1: mở Google OAuth (popup gọi endpoint này)
        [HttpGet("google")]
        public IActionResult Google()
        {
            var props = new AuthenticationProperties
            {
                RedirectUri = Url.Content("~/api/auth/callback")
            };
            return Challenge(props, "Google"); // hoặc GoogleDefaults.AuthenticationScheme
        }

        // Bước 2: Google redirect về đây -> đóng popup & báo cho SPA
        [Authorize]
        [HttpGet("callback")]
        public ContentResult Callback()
        {
            const string spa = "http://localhost:5173";
            return Content($@"<!doctype html><script>
      try{{ window.opener && window.opener.postMessage('auth:success','{spa}'); }}catch(e){{}}
      window.close();
    </script>", "text/html");
        }

        // Bước 3: SPA gọi để lấy thông tin user
        [Authorize]
        [HttpGet("me")]
        public IActionResult Me()
        {
            string? picture =
                User.Claims.FirstOrDefault(c => c.Type == "picture")?.Value
                ?? User.Claims.FirstOrDefault(c => c.Type == "urn:google:picture")?.Value
                ?? User.Claims.FirstOrDefault(c => c.Type.Contains("picture"))?.Value;

            return Ok(new
            {
                name = User.Identity?.Name,
                email = User.Claims.FirstOrDefault(c => c.Type.Contains("email"))?.Value,
                picture
            });
        }

        // Bước 4: đăng xuất
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(); // mặc định cookie scheme
            return Ok();
        }
    }
}
