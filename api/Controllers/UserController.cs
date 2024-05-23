using api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]/[action]")]
public class UserController : ControllerBase
{
    private readonly BuysellDbContext _context;

    public UserController(BuysellDbContext context)
    {
        _context = context;
    }

    // Получение профиля текущего пользователя
    [HttpGet("profile")]
    [Authorize]
    public async Task<IActionResult> GetProfile()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var user = await _context.Users.FindAsync(Guid.Parse(userId));

        if (user == null)
        {
            return NotFound("User not found");
        }

        return Ok(new
        {
            user.Id,
            user.Username,
            user.Email
        });
    }
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await _context.Users.ToListAsync();

        if (!users.Any())
        {
            return NotFound("No users found");
        }

        return Ok(users);
    }

    // Обновление профиля текущего пользователя
    [HttpPut("profile")]
    [Authorize]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileModel model)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var user = await _context.Users.FindAsync(Guid.Parse(userId));

        if (user == null)
        {
            return NotFound("User not found");
        }

        user.Email = model.Email;

        _context.Users.Update(user);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            user.Id,
            user.Username,
            user.Email
        });
    }

    // Удаление текущего пользователя
    [HttpDelete("profile")]
    [Authorize]
    public async Task<IActionResult> DeleteProfile()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var user = await _context.Users.FindAsync(Guid.Parse(userId));

        if (user == null)
        {
            return NotFound("User not found");
        }

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return Ok("User deleted successfully");
    }
}

public class UpdateProfileModel
{
    public string Email { get; set; }
}
