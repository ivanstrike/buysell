using api.Data;
using api.Models;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Collections;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
// ...

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly BuysellDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthController(BuysellDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    [HttpPost("Register")]
    public IActionResult Register(RegisterRequest model)
    {
        if (_context.Users.Any(u => u.Email == model.Email))
        {
            return BadRequest("Username or email already exists");
        }

        if(model.Password == null || model.Password =="" || model.Username == null || model.Username == "" || model.Email == null || model.Email == "" || !model.Email.Contains("@"))  
        {
            return BadRequest("Bad data");
        }

        var user = new User
        {
            Id = Guid.NewGuid(),
            Username = model.Username,
            Password = model.Password,
            Email = model.Email,
            Cart = null
        };

        _context.Users.Add(user);
        _context.SaveChanges();

        return Ok();
    }

    [HttpPost("Login")]
    public IActionResult Login(LoginRequest model)
    {
        var user = _context.Users.FirstOrDefault(u => u.Email == model.Email);
        if (user == null || user.Password != model.Password)
        {
            return Unauthorized();
        }

        var token = GenerateJwtToken(user);
        return Ok(new { token });
    }

    private string GenerateJwtToken(User user)
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");
        var secretKey = jwtSettings["SecretKey"];
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim("userId", user.Id.ToString())
        };

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: DateTime.Now.AddHours(10),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public class LoginRequest
    {
        [Required]
        public string Password { get; set; }

        [Required]
        public string Email { get; set; }
    }


    public class RegisterRequest
    {
        [Required]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        public string Email { get; set; }
    }


}
