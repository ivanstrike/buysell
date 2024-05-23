namespace api.Models
{
    public class Cart
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public ICollection<CartItem> CartItems { get; set; }
    }
}
