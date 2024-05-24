using api.Data;
using api.Models;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Collections;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
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
    private readonly ILogger<CartController> _logger;
    public AuthController(BuysellDbContext context, IConfiguration configuration, ILogger<CartController> logger)
    {
        _context = context;
        _configuration = configuration;
        _logger = logger;
    }

    [HttpPost("Register")]
    public IActionResult Register(RegisterRequest model)
    {
        _logger.LogInformation($"{model}");
        Debug.WriteLine($"Register request: {model}");
        if (_context.Users.Any(u => u.Email == model.Email))
        {
            return BadRequest("Username or email already exists");
        }

        if(model.Password == null || model.Password =="" || model.Username == null || model.Username == "" || model.Email == null || model.Email == "" || !model.Email.Contains("@"))  
        {
            Debug.WriteLine("Bad data: password, username or email is null or empty or email does not contain @");
            return BadRequest("Bad data");
        }
        if (model.Password.Length < 8)
        {
            return BadRequest("Password must be at least 8 characters long and contain at least one special character");
        }

        var user = new User
        {
            Id = Guid.NewGuid(),
            Username = model.Username,
            Email = model.Email,
            Password = model.Password
        };

        var cart = new Cart
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            CartItems = new List<CartItem>()
        };

        _context.Carts.Add(cart);
        _context.Users.Add(user);

        user.Cart = cart;
        _context.SaveChanges();

        var updatedUser = _context.Users.Include(u => u.Cart).FirstOrDefault(u => u.Id == user.Id);
        return Ok(updatedUser);
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
