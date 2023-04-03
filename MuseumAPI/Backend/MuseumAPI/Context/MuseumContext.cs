using Microsoft.EntityFrameworkCore;
using MuseumAPI.Models;

namespace MuseumAPI.Context
{
    public class MuseumContext : DbContext
    {
        public MuseumContext() { }

        public MuseumContext(DbContextOptions<MuseumContext> options) : base(options)
        {
            // EnsureDeleted to skip migrations
            // delete to keep data between runs
            //Database.EnsureDeleted();
            Database.EnsureCreated();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Define one-to-many relationship
            modelBuilder.Entity<Painting>()
                .HasOne(a => a.Artist)
                .WithMany(p => p.Paintings)
                .HasForeignKey(a => a.ArtistId);

            // Define many-to-many relationship
            modelBuilder.Entity<Museum>()
                .HasMany(p => p.Artists)
                .WithMany(p => p.Museums)
                .UsingEntity<Exhibition>(
                    j => j
                        .HasOne(pt => pt.Artist)
                        .WithMany(t => t.Exhibitions)
                        .HasForeignKey(pt => pt.ArtistId),
                    j => j
                        .HasOne(pt => pt.Museum)
                        .WithMany(p => p.Exhibitions)
                        .HasForeignKey(pt => pt.MuseumId),
                    j =>
                    {
                        j.Property(pt => pt.StartDate).HasDefaultValueSql("CURRENT_TIMESTAMP");
                        j.Property(pt => pt.EndDate).HasDefaultValueSql("CURRENT_TIMESTAMP");
                        j.HasKey(t => new { t.ArtistId, t.MuseumId });
                    });
        }

        public virtual DbSet<Painting> Paintings { get; set; } = null!;

        public virtual DbSet<Artist> Artists { get; set; } = null!;

        public virtual DbSet<Museum> Museums { get; set; } = null!;

        public virtual DbSet<Exhibition> Exhibitions { get; set; } = null!;
    }
}
