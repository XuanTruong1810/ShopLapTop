using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("/api/[controller]/[action]")]
public class InfoUser : ControllerBase
{
    public readonly UserManager<ApplicationUser> userManager;
    public InfoUser(UserManager<ApplicationUser> userManager)
    {
        this.userManager = userManager;
    }
    [Authorize]
    [HttpGet]
    public async Task<ActionResult> Get()
    {
        var Email = User.FindFirstValue(ClaimTypes.Email);
        if (Email != null)
        {
            var user = await userManager.FindByEmailAsync(Email);

            if (user != null)
            {
                var data = new
                {
                    user.UserName,
                    Image = $"{user.Image}",
                    user.Gender,
                    user.PhoneNumber,
                    user.Email,
                    user.Birthday,
                };
                return Ok(data);
            }
            else
            {
                return NotFound("Không tìm thấy người dùng");
            }
        }
        else
        {
            return BadRequest("Lỗi");
        }
    }
}