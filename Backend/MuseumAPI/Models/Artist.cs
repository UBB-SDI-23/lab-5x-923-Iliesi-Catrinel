namespace MuseumAPI.Models
{
    public class Artist
    {
        public long Id { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public DateTime? BirthDate { get; set; }
        public string? BirthPlace { get; set; }
        public string? Education { get; set; }
        public string? Movement { get; set; }

        // Hiden from the API because it's not in the DTO
        public virtual ICollection<Painting> Paintings { get; set; } = null!;

        public virtual ICollection<Museum> Museums { get; set; } = null!;
        public virtual ICollection<Exhibition> Exhibitions { get; set; } = null!;

        public virtual long? UserId { get; set; }
        public virtual User User { get; set; } = null!;
    }
}
