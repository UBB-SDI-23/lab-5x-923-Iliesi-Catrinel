namespace MuseumAPI.Models
{
    public class MuseumDTO
    {
        public long Id { get; set; }
        public string? Name { get; set; }
        public string? Address { get; set; }
        public DateTime? FoundationDate { get; set; }
        public string? Architect { get; set; }
        public string? Website { get; set; }
    }
}
