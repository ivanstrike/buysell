using api.Data;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

[Route("api/[controller]/[action]")]
[ApiController]
public class CartController : ControllerBase
{
    private readonly BuysellDbContext _context;
    private readonly IUserService _userService;
    private readonly ILogger<CartController> _logger;
    public CartController(BuysellDbContext context, IUserService userService, ILogger<CartController> logger)
    {
        _context = context;
        _userService = userService;
        _logger = logger;
    }
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Cart>>> GetProducts()
    {
        return await _context.Carts.ToListAsync();
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<Product>> AddToCart(string productId)
    {
        _logger.LogInformation("Received productId: {productId}", productId);

        try
        {
            if (!Guid.TryParse(productId, out Guid productGuid))
            {
                _logger.LogError("Invalid productId format: {productId}", productId);
                return BadRequest("Invalid productId format.");
            }

            _logger.LogInformation("Parsed productId: {productGuid}", productGuid);

            var userId = _userService.GetUserId();
            _logger.LogInformation("UserId: {userId}", userId);

            var product = await _context.Products.FindAsync(productGuid);
            if (product == null)
            {
                _logger.LogError("Product not found: {productGuid}", productGuid);
                return NotFound();
            }

            var userIdGuid = Guid.Parse(userId);
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .ThenInclude(ci => ci.Product)
                .FirstOrDefaultAsync(c => c.UserId == userIdGuid);

            if (cart == null)
            {
                cart = new Cart { Id = Guid.NewGuid(), UserId = userIdGuid };
                _context.Carts.Add(cart);
                await _context.SaveChangesAsync();
            }

            var cartItem = cart.CartItems.FirstOrDefault(i => i.ProductId == productGuid);
            if (cartItem == null)
            {
                cartItem = new CartItem { Product = product, Quantity = 1 };
                cart.CartItems.Add(cartItem);
            }
            else
            {
                cartItem.Quantity++;
            }

            _context.Carts.Update(cart);
            await _context.SaveChangesAsync();

            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while adding product to cart.");
            return StatusCode(500, "Internal server error.");
        }
    }
    [HttpGet]
    [Authorize]
    public async Task<ActionResult<Cart>> GetCart()
    {
        try
        {
            var userId = _userService.GetUserId();
            _logger.LogInformation("UserId: {userId}", userId);

            if (!Guid.TryParse(userId, out Guid userIdGuid))
            {
                _logger.LogError("Invalid UserId format: {userId}", userId);
                return BadRequest("Invalid UserId format.");
            }

            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .ThenInclude(ci => ci.Product)
                .FirstOrDefaultAsync(c => c.UserId == userIdGuid);

            if (cart == null)
            {
                return NotFound("Cart not found.");
            }

            return Ok(cart);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while retrieving the cart.");
            return StatusCode(500, "Internal server error.");
        }
    }
}

public interface IUserService
{
    string GetUserId();
}

public class UserService : IUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public UserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public string GetUserId()
    {
        var userIdClaim = _httpContextAccessor.HttpContext?.User?.FindFirst("userId");
        return userIdClaim?.Value;
    }
}


