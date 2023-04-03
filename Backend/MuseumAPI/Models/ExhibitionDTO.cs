namespace MuseumAPI.Models
{
    public class ExhibitionDTO
    {
        public long ArtistId { get; set; }
        public long MuseumId { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
