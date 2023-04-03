namespace MuseumAPI.Models
{
    public class ArtistMuseumListDTO
    {
        public long ArtistId { get; set; }
        public List<long> MuseumId { get; set; } = null!;

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
