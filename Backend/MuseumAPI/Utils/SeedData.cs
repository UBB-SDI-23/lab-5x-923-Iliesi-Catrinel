using Microsoft.EntityFrameworkCore;
using MuseumAPI.Context;
using MuseumAPI.Models;

namespace MuseumAPI.Utils
{
    public class SeedData
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using (var context = new MuseumContext(serviceProvider.GetRequiredService<DbContextOptions<MuseumContext>>()))
            {
                return;

                SeedArtists(context);
                SeedPaintings(context);
                SeedMuseums(context);
                SeedExhibitions(context);
            }
        }

        private static void SeedArtists(MuseumContext context)
        {
            if (context.Artists.Any())
                return;

            context.Artists.AddRange(
                new Artist
                {
                    FirstName = "Leonardo",
                    LastName = "da Vinci",
                    BirthDate = new DateTime(1452, 4, 15),
                    BirthPlace = "Vinci, Florence",
                    Education = "Studio of Andrea del Verrocchio",
                    Movement = "High Renaissance",
                },
                new Artist
                {
                    FirstName = "Pablo",
                    LastName = "Picasso",
                    BirthDate = new DateTime(1881, 10, 25),
                    BirthPlace = "Malaga, Spain",
                    Education = "Real Academia de Bellas Artes de San Fernando",
                    Movement = "Cubism, Surrealism",
                },
                new Artist
                {
                    FirstName = "Johannes",
                    LastName = "Vermeer",
                    BirthDate = new DateTime(1632, 10, 31),
                    BirthPlace = "Delft, Holland",
                    Education = "Amsterdam",
                    Movement = "Dutch Golden Age, Baroque",
                },
                new Artist
                {
                    FirstName = "Paolo",
                    LastName = "Veronese",
                    BirthDate = new DateTime(1528, 1, 1),
                    BirthPlace = "Verona, Venice",
                    Education = "Venice",
                    Movement = "Renaissance",
                },
                new Artist
                {
                    FirstName = "Vincent",
                    LastName = "van Gogh",
                    BirthDate = new DateTime(1853, 3, 30),
                    BirthPlace = "Zundert, Netherlands",
                    Education = "Royal Academy of Fine Arts",
                    Movement = "Post-Impressionism",
                },
                new Artist
                {
                    FirstName = "Salvador",
                    LastName = "Dali",
                    BirthDate = new DateTime(1904, 5, 11),
                    BirthPlace = "Zundert, Netherlands",
                    Education = "Real Academia de Bellas Artes de San Fernando",
                    Movement = "Cubism, Surrealism",
                },
                new Artist
                {
                    FirstName = "Claude",
                    LastName = "Monet",
                    BirthDate = new DateTime(1840, 11, 14),
                    BirthPlace = "Paris, France",
                    Education = "Académie Suisse",
                    Movement = "Impressionism",
                },
                new Artist
                {
                    FirstName = "Michelangelo",
                    LastName = "Buonarroti",
                    BirthDate = new DateTime(1475, 3, 6),
                    BirthPlace = "Caprese, Tuscany",
                    Education = "Florence",
                    Movement = "High Renaissance",
                },
                new Artist
                {
                    FirstName = "Edgar",
                    LastName = "Degas",
                    BirthDate = new DateTime(1834, 7, 19),
                    BirthPlace = "Paris, France",
                    Education = "Paris",
                    Movement = "Impressionism",
                },
                new Artist
                {
                    FirstName = "Albrecht",
                    LastName = "Dürer",
                    BirthDate = new DateTime(1471, 5, 21),
                    BirthPlace = "Nuremberg, Germany",
                    Education = "Nuremberg",
                    Movement = "Northern Renaissance",
                },
                new Artist
                {
                    FirstName = "Rembrandt",
                    LastName = "van Rijn",
                    BirthDate = new DateTime(1606, 7, 15),
                    BirthPlace = "Leiden, Holland",
                    Education = "Leiden",
                    Movement = "Dutch Golden Age",
                },
                new Artist
                {
                    FirstName = "Henri",
                    LastName = "Matisse",
                    BirthDate = new DateTime(1869, 12, 31),
                    BirthPlace = "Le Cateau-Cambrésis, France",
                    Education = "Académie Julian",
                    Movement = "Fauvism, Expressionism",
                },
                new Artist
                {
                    FirstName = "Pierre-Auguste",
                    LastName = "Renoir",
                    BirthDate = new DateTime(1841, 2, 25),
                    BirthPlace = "Limoges, France",
                    Education = "Paris",
                    Movement = "Impressionism",
                },
                new Artist
                {
                    FirstName = "Paul",
                    LastName = "Cézanne",
                    BirthDate = new DateTime(1839, 1, 19),
                    BirthPlace = "Aix-en-Provence, France",
                    Education = "Académie Suisse",
                    Movement = "Post-Impressionism",
                },
                new Artist
                {
                    FirstName = "Gustav",
                    LastName = "Klimt",
                    BirthDate = new DateTime(1862, 7, 14),
                    BirthPlace = "Baumgarten, Austria",
                    Education = "Vienna",
                    Movement = "Symbolism, Art Nouveau",
                },
                new Artist
                {
                    FirstName = "Edvard",
                    LastName = "Munch",
                    BirthDate = new DateTime(1863, 12, 12),
                    BirthPlace = "Løten, Norway",
                    Education = "Oslo",
                    Movement = "Expressionism",
                },
                new Artist
                {
                    FirstName = "Marc",
                    LastName = "Chagall",
                    BirthDate = new DateTime(1887, 7, 7),
                    BirthPlace = "Vitebsk, Belarus",
                    Education = "Saint Petersburg",
                    Movement = "Cubism, Expressionism",
                },
                new Artist
                {
                    FirstName = "Andy",
                    LastName = "Warhol",
                    BirthDate = new DateTime(1928, 8, 6),
                    BirthPlace = "Pittsburgh, Pennsylvania",
                    Education = "Carnegie Institute of Technology",
                    Movement = "Pop Art",
                }
            );

            context.SaveChanges();
        }

        private static void SeedPaintings(MuseumContext context)
        {
            if (context.Paintings.Any())
                return;

            var artist = context.Artists.First() ?? throw new Exception("No artists found!");
            long artistId = artist.Id;

            var artist2 = context.Artists.Skip(1).First() ?? context.Artists.First();
            long artist2Id = artist2.Id;

            var artist3 = context.Artists.Skip(2).First() ?? context.Artists.First();
            long artist3Id = artist3.Id;

            var artist4 = context.Artists.Skip(3).First() ?? context.Artists.First();
            long artist4Id = artist2.Id;

            context.Paintings.AddRange(
                new Painting
                {
                    Title = "Mona Lisa",
                    CreationYear = 1503,
                    Height = 0.77,
                    Subject = "Lisa Gherardini",
                    Medium = "Oil on poplar panel",
                    ArtistId = artistId,
                    Description = "Description 1",
                    Artist = artist,
                },
                new Painting
                {
                    Title = "The Starry Night",
                    CreationYear = 1889,
                    Height = 0.73,
                    Subject = "View from the window, before sunrise",
                    Medium = "Oil on canvas",
                    Description = "Description 2",
                    ArtistId = artist2Id,
                    Artist = artist2,
                },
                new Painting
                {
                    Title = "Girl with a Pearl Earring",
                    CreationYear = 1665,
                    Height = 0.44,
                    Subject = "European girl wearing an exotic dress, an oriental turban and a large pearl as an earring",
                    Medium = "Oil on canvas",
                    Description = "Description 3",
                    ArtistId = artist3Id,
                    Artist = artist3,
                },
                new Painting
                {
                    Title = "The Virgin and Child with Saint Anne",
                    CreationYear = 1501,
                    Height = 1.30,
                    Subject = "Saint Anne, her daughter, the Virgin Mary, and the infant Jesus",
                    Medium = "Oil on wood",
                    Description = "Description 4",
                    ArtistId = artist2Id,
                    Artist = artist2,
                },
                new Painting
                {
                    Title = "Café Terrace at Night",
                    CreationYear = 1888,
                    Height = 0.8,
                    Subject = "Popular coffee house  in Arles, France, in mid-September 1888, at night",
                    Medium = "Oil on canvas",
                    Description = "Description 5",
                    ArtistId = artistId,
                    Artist = artist,
                },
                new Painting
                {
                    Title = "Van Gogh self-portrait",
                    CreationYear = 1889,
                    Height = 0.65,
                    Subject = "Dutch Post-Impressionist painter Vincent van Gogh",
                    Medium = "Oil on canvas",
                    Description = "Description 6",
                    ArtistId = artist4Id,
                    Artist = artist4,
                },
                new Painting
                {
                    Title = "The Wedding at Cana",
                    CreationYear = 1563,
                    Height = 6.77,
                    Subject = "Biblical story of the Marriage at Cana, at which Jesus miraculously converts water into red wine",
                    Medium = "Oil on canvas",
                    Description = "Description 7",
                    ArtistId = artist3Id,
                    Artist = artist3,
                },
                new Painting
                {
                    Title = "The Raft of the Medusa",
                    CreationYear = 1818,
                    Height = 4.90,
                    Subject = "A moment from the aftermath of the wreck of the French naval frigate Méduse, which ran aground off the coast of today's Mauritania on 2 July 1816",
                    Medium = "Oil on canvas",
                    Description = "Description 8",
                    ArtistId = artist2Id,
                    Artist = artist2,
                },
                new Painting
                {
                    Title = "Starry Night Over the Rhone",
                    CreationYear = 1888,
                    Height = 0.72,
                    Subject = "Arles at night, close to the Yellow House on the Place Lamartine, which Van Gogh was renting at the time",
                    Medium = "Oil on canvas",
                    Description = "Description 9",
                    ArtistId = artistId,
                    Artist = artist,
                },
                new Painting
                {
                    Title = "Diana and Her Companions",
                    CreationYear = 1655,
                    Height = 0.98,
                    Subject = "Goddess Diana",
                    Medium = "Oil on canvas",
                    Description = "Description 10",
                    ArtistId = artist4Id,
                    Artist = artist4,
                },
                new Painting
                {
                    Title = "View of Delft",
                    CreationYear = 1660,
                    Height = 0.96,
                    Subject = "The Dutch artist's hometown",
                    Medium = "Oil on canvas",
                    Description = "Description 11",
                    ArtistId = artistId,
                    Artist = artist,
                },
                new Painting
                {
                    Title = "Les Demoiselles d'Avignon",
                    CreationYear = 1907,
                    Height = 24.3,
                    Subject = "Five nude female prostitutes in a brothel in Barcelona, Spain",
                    Medium = "Oil on canvas",
                    Description = "Description 12",
                    ArtistId = artist2Id,
                    Artist = artist2,
                },
                new Painting
                {
                    Title = "Boy Leading a Horse",
                    CreationYear = 1905,
                    Height = 22.06,
                    Subject = "Nude, unmounted figure leading a horse",
                    Medium = "Oil on canvas",
                    Description = "Description 13",
                    ArtistId = artist4Id,
                    Artist = artist4,
                }
            );

            context.SaveChanges();
        }

        private static void SeedMuseums(MuseumContext context)
        {
            if (context.Museums.Any())
                return;

            context.Museums.AddRange(
                new Museum
                {
                    Name = "Louvre",
                    Address = "75001, Paris, France",
                    FoundationDate = new DateTime(1793, 8, 10),
                    Architect = "I. M. Pei",
                    Website = "https://www.louvre.fr/en",
                },
                new Museum
                {
                    Name = "Musée d'Orsay",
                    Address = "Rue de Lille 75343 Paris, France",
                    FoundationDate = new DateTime(1986, 1, 1),
                    Architect = "Gae Aulenti",
                    Website = "https://www.musee-orsay.fr/en",
                },
                new Museum
                {
                    Name = "Museum of Modern Art",
                    Address = "11 West 53rd Street Manhattan, New York City",
                    FoundationDate = new DateTime(1929, 11, 7),
                    Architect = "Yoshio Taniguchi",
                    Website = "https://www.moma.org/",
                },
                new Museum
                {
                    Name = "Mauritshuis",
                    Address = "Plein 29, The Hague, Netherlands",
                    FoundationDate = new DateTime(1822, 1, 2),
                    Architect = "Jacob van Campen",
                    Website = "https://www.mauritshuis.nl/",
                },
                new Museum
                {
                    Name = "National Gallery",
                    Address = "Trafalgar Square, London, United Kingdom",
                    FoundationDate = new DateTime(1824, 1, 1),
                    Architect = "William Wilkins",
                    Website = "https://www.nationalgallery.org.uk/",
                },
                new Museum
                {
                    Name = "National Gallery of Art",
                    Address = "6th Street and Constitution Avenue NW, Washington, DC",
                    FoundationDate = new DateTime(1937, 1, 1),
                    Architect = "John Russell Pope",
                    Website = "https://www.nga.gov/",
                },
                new Museum
                {
                    Name = "The Uffizi Galleryt",
                    Address = "Piazzale degli Uffizi, 6, 50122 Firenze FI, Italy",
                    FoundationDate = new DateTime(1581, 1, 1),
                    Architect = "Giorgio Vasari",
                    Website = "https://www.uffizi.it/en/the-uffizi",
                },
                new Museum
                {
                    Name = "Winter Palace",
                    Address = "Palace Embankment, 32, St Petersburg, Russia, 190000",
                    FoundationDate = new DateTime(1764, 1, 1),
                    Architect = "Francesco Bartolomeo Rastrelli",
                    Website = "https://www.hermitagemuseum.org/wps/portal/hermitage/explore/buildings/locations/building/B10/",
                },
                new Museum
                {
                    Name = "The British Museum",
                    Address = "Great Russell St, London WC1B 3DG, United Kingdom",
                    FoundationDate = new DateTime(1753, 1, 1),
                    Architect = "Foster & Partners",
                    Website = "https://www.britishmuseum.org/",
                },
                new Museum
                {
                    Name = "The State Hermitage Museum",
                    Address = "Nevsky pr., 28, St Petersburg, Russia, 191186",
                    FoundationDate = new DateTime(1764, 1, 1),
                    Architect = "Francesco Bartolomeo Rastrelli",
                    Website = "https://www.hermitagemuseum.org/",
                },
                new Museum
                {
                    Name = "The Prado Museum",
                    Address = "Paseo del Prado, s/n, 28014 Madrid, Spain",
                    FoundationDate = new DateTime(1819, 1, 1),
                    Architect = "Juan de Villanueva",
                    Website = "https://www.museodelprado.es/en",
                }

            );

            context.SaveChanges();
        }

        private static void SeedExhibitions(MuseumContext context)
        {
            if (context.Exhibitions.Any())
                return;

            var artist = context.Artists.First() ?? throw new Exception("No artists found!");
            long artistId = artist.Id;

            var artist2 = context.Artists.Skip(1).First() ?? context.Artists.First();
            long artist2Id = artist2.Id;

            var museum = context.Museums.First() ?? throw new Exception("No museums found!");
            long museumId = museum.Id;

            var museum2 = context.Museums.Skip(1).First() ?? context.Museums.First();
            long museum2Id = museum2.Id;

            var museum3 = context.Museums.Skip(2).First() ?? context.Museums.First();
            long museum3Id = museum3.Id;

            var museum4 = context.Museums.Skip(3).First() ?? context.Museums.First();
            long museum4Id = museum4.Id;

            var museum5 = context.Museums.Skip(4).First() ?? context.Museums.First();
            long museum5Id = museum5.Id;

            context.Exhibitions.AddRange(
                new Exhibition
                {
                    MuseumId = museumId,
                    Museum = museum,
                    ArtistId = artistId,
                    Artist = artist,
                    StartDate = new DateTime(2019, 1, 1),
                    EndDate = new DateTime(2019, 12, 31),
                },
                new Exhibition
                {
                    MuseumId = museumId,
                    Museum = museum,
                    ArtistId = artist2Id,
                    Artist = artist2,
                    StartDate = new DateTime(2020, 1, 1),
                    EndDate = new DateTime(2020, 12, 31),
                },
                new Exhibition
                {
                    MuseumId = museum2Id,
                    Museum = museum2,
                    ArtistId = artistId,
                    Artist = artist,
                    StartDate = new DateTime(2021, 1, 1),
                    EndDate = new DateTime(2021, 12, 31),
                },
                new Exhibition
                {
                    MuseumId = museum2Id,
                    Museum = museum2,
                    ArtistId = artist2Id,
                    Artist = artist2,
                    StartDate = new DateTime(2022, 1, 1),
                    EndDate = new DateTime(2022, 12, 31),
                },
                new Exhibition
                {
                    MuseumId = museum3Id,
                    Museum = museum3,
                    ArtistId = artistId,
                    Artist = artist,
                    StartDate = new DateTime(2023, 1, 1),
                    EndDate = new DateTime(2023, 12, 31),
                },
                new Exhibition
                {
                    MuseumId = museum3Id,
                    Museum = museum3,
                    ArtistId = artist2Id,
                    Artist = artist2,
                    StartDate = new DateTime(2024, 1, 1),
                    EndDate = new DateTime(2024, 12, 31),
                },
                new Exhibition
                {
                    MuseumId = museum4Id,
                    Museum = museum4,
                    ArtistId = artistId,
                    Artist = artist,
                    StartDate = new DateTime(2018, 1, 1),
                    EndDate = new DateTime(2018, 12, 31),
                },
                new Exhibition
                {
                    MuseumId = museum4Id,
                    Museum = museum4,
                    ArtistId = artist2Id,
                    Artist = artist2,
                    StartDate = new DateTime(2017, 1, 1),
                    EndDate = new DateTime(2017, 12, 31),
                },
                new Exhibition
                {
                    MuseumId = museum5Id,
                    Museum = museum5,
                    ArtistId = artistId,
                    Artist = artist,
                    StartDate = new DateTime(2016, 1, 1),
                    EndDate = new DateTime(2016, 12, 31),
                },
                new Exhibition
                {
                    MuseumId = museum5Id,
                    Museum = museum5,
                    ArtistId = artist2Id,
                    Artist = artist2,
                    StartDate = new DateTime(2015, 1, 1),
                    EndDate = new DateTime(2015, 12, 31),
                }
                );

           context.SaveChanges();
        }
    }
}
