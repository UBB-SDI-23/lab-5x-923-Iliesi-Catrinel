namespace MuseumAPI.Models
{
    public class Painting
    {
        public long Id { get; set; }
        public string? Title { get; set; }
        public int CreationYear { get; set; }
        public double Height { get; set; }
        public string? Subject { get; set; }
        public string? Medium { get; set; }
        public string? Description { get; set; }

        public long ArtistId { get; set; }

        // Hiden from the API because it's not in the DTO
        public virtual Artist Artist { get; set; } = null!;
    }
}
