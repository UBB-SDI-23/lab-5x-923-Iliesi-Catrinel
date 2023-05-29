namespace MuseumAPI.Models
{
    public class PaintingDTO
    {
        public long Id { get; set; }
        public string? Title { get; set; }
        public int CreationYear { get; set; }
        public double Height { get; set; }
        public string? Subject { get; set; }
        public string? Medium { get; set; }
        public string? Description { get; set; }
        public double Price { get; set; }

        public long? ArtistId { get; set; }
    }
}
