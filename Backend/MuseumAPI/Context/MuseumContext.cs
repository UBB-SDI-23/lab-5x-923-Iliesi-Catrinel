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

            // UserProfile has the primary key equal to the id of the User
            modelBuilder.Entity<UserProfile>()
                .HasKey(u => u.UserId);

            // Set PagePreference default value to 5
            modelBuilder.Entity<UserProfile>()
                .Property(u => u.PagePreference)
                .HasDefaultValue(5);

            // Define unique constraints
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Name)
                .IsUnique();

            modelBuilder.Entity<ConfirmationCode>()
                .HasIndex(u => u.Code)
                .IsUnique();

            // Define one-to-one relationships
            modelBuilder.Entity<User>()
                .HasOne(u => u.UserProfile)
                .WithOne(p => p.User)
                .HasForeignKey<UserProfile>(p => p.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull);
            //.OnDelete(DeleteBehavior.ClientCascade);

            // Define one-to-many relationship
            modelBuilder.Entity<Painting>()
                .HasOne(a => a.Artist)
                .WithMany(p => p.Paintings)
                .HasForeignKey(a => a.ArtistId)
                .OnDelete(DeleteBehavior.ClientSetNull);

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

            // Assign users to entities
            modelBuilder.Entity<ConfirmationCode>()
                .HasOne(u => u.User)
                .WithMany()
                .HasForeignKey(u => u.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            modelBuilder.Entity<Artist>()
                .HasOne(u => u.User)
                .WithMany()
                .HasForeignKey(u => u.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            modelBuilder.Entity<Painting>()
                .HasOne(u => u.User)
                .WithMany()
                .HasForeignKey(u => u.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            modelBuilder.Entity<Museum>()
                .HasOne(u => u.User)
                .WithMany()
                .HasForeignKey(u => u.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            modelBuilder.Entity<Exhibition>()
                .HasOne(u => u.User)
                .WithMany()
                .HasForeignKey(u => u.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        }

        public virtual DbSet<ConfirmationCode> ConfirmationCodes { get; set; } = null!;

        public virtual DbSet<User> Users { get; set; } = null!;
        public virtual DbSet<UserProfile> UserProfiles { get; set; } = null!;

        public virtual DbSet<Painting> Paintings { get; set; } = null!;

        public virtual DbSet<Artist> Artists { get; set; } = null!;

        public virtual DbSet<Museum> Museums { get; set; } = null!;

        public virtual DbSet<Exhibition> Exhibitions { get; set; } = null!;
    }
}
