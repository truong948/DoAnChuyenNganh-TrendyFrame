using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Khunghinh.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        // Bước 1: mở Google OAuth
        [HttpGet("google")]
        public IActionResult Google()
        {
            return Challenge(
                new AuthenticationProperties { RedirectUri = Url.Action("Callback") },
                "Google"
            );
        }

        // Bước 2: Google redirect về đây → trả script đóng popup
        [HttpGet("callback")]
        public ContentResult Callback()
        {
            return Content(@"<!doctype html><script>
                try{window.opener&&window.opener.postMessage('auth:success','*')}catch(e){};window.close();
            </script>", "text/html");
        }

        // Bước 3: frontend gọi /api/auth/me để lấy thông tin user
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
            await HttpContext.SignOutAsync();
            return Ok();
        }

    }
}
