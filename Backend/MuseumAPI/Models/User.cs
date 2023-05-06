namespace MuseumAPI.Models
{
    public class User
    {
        public virtual long Id { get; set; }
        public virtual string? Name { get; set; }
        public virtual string? Password { get; set; }

        // Hidden from the API because it's not in the DTO
        public virtual long AccessLevel { get; set; }
        public virtual UserProfile UserProfile { get; set; } = null!;
    }
}
