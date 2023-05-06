namespace MuseumAPI.Models
{
    public class Exhibition
    {
        public long ArtistId { get; set; }
        public virtual Artist Artist { get; set; } = null!;

        public long MuseumId { get; set; }
        public virtual Museum Museum { get; set; } = null!;

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public virtual long? UserId { get; set; }
        public virtual User User { get; set; } = null!;
    }
}
