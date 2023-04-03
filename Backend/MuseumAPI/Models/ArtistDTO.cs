namespace MuseumAPI.Models
{
    public class ArtistDTO
    {
        public long Id { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public DateTime? BirthDate { get; set; }
        public string? BirthPlace { get; set; }
        public string? Education { get; set; }
        public string? Movement { get; set; }
    }
}
