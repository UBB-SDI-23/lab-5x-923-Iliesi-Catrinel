namespace MuseumAPI.Models
{
    public class UserProfileDTO
    {
        public virtual long Id { get; set; }
        public virtual string? Name { get; set; }
        public virtual string? Password { get; set; }

        public virtual UserProfile UserProfile { get; set; } = null!;

        public virtual int ArtistCount { get; set; }
        public virtual int PaintingCount { get; set; }
        public virtual int MuseumCount { get; set; }
        public virtual int ExhibitionCount { get; set; }
    }
}
