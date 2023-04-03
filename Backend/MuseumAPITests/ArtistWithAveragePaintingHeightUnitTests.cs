using Moq;
using Moq.EntityFrameworkCore;
using MuseumAPI.Context;
using MuseumAPI.Controllers;
using MuseumAPI.Models;
using MuseumAPI.Validation;
using MuseumAPITests;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MuseumAPITests
{
    [TestFixture]
    public class ArtistWithAveragePaintingHeightUnitTests
    {
        private Mock<MuseumContext> _contextMock;

        [SetUp]
        public void Setup()
        {
            // create a mock of the MuseumContext
            _contextMock = new Mock<MuseumContext>();
        }

        [Test]
        public async Task GetArtistWithAveragePaintingHeight_ReturnsExpectedResult()
        {
            // arrange
            var artists = new List<Artist>
            {
                new Artist { Id = 1, FirstName = "Vincent", LastName = "van Gogh", BirthDate = new DateTime(1853, 3, 30) },
                new Artist { Id = 2, FirstName = "Pablo", LastName = "Picasso", BirthDate = new DateTime(1881, 10, 25) },
                new Artist { Id = 3, FirstName = "Claude", LastName = "Monet", BirthDate = new DateTime(1840, 11, 14) },
                new Artist { Id = 4, FirstName = "Edvard", LastName = "Munch", BirthDate = new DateTime(1863, 12, 12) },
            };

            var paintings = new List<Painting>
            {
                new Painting { Id = 1, Title = "The Starry Night", CreationYear = 1889, ArtistId = 1, Height = 22.06 },
                new Painting { Id = 2, Title = "Les Demoiselles d'Avignon", CreationYear = 1907, ArtistId = 2, Height = 12.50 },
                new Painting { Id = 3, Title = "Water Lilies", CreationYear = 1916, ArtistId = 3, Height = 18.50 },
                new Painting { Id = 4, Title = "Sunflowers", CreationYear = 1888, ArtistId = 1, Height = 50.70 },
                new Painting { Id = 5, Title = "Guernica", CreationYear = 1937, ArtistId = 2, Height = 80.00 },
                new Painting { Id = 6, Title = "The Scream", CreationYear = 1893, ArtistId = 4, Height = 91.00 },
                new Painting { Id = 7, Title = "The Gleaners", CreationYear = 1857, ArtistId = 3, Height = 51.00 },
                new Painting { Id = 8, Title = "The Potato Eaters", CreationYear = 1885, ArtistId = 1, Height = 30.74 },
            };

            _contextMock.Setup(c => c.Artists).ReturnsDbSet(artists);
            _contextMock.Setup(c => c.Paintings).ReturnsDbSet(paintings);

            var controller = new ArtistsController(_contextMock.Object);

            // act
            var result = await controller.GetArtistWithAveragePaintingHeight();

            // assert
            Assert.That(result.Count, Is.EqualTo(4));
            Assert.That(result[0].Id, Is.EqualTo(1));
            Assert.That(result[1].Id, Is.EqualTo(3));
            Assert.That(result[2].Id, Is.EqualTo(2));
            Assert.That(result[3].Id, Is.EqualTo(4));
            Assert.That(result[0].FirstName, Is.EqualTo("Vincent"));
            Assert.That(result[1].FirstName, Is.EqualTo("Claude"));
            Assert.That(result[2].FirstName, Is.EqualTo("Pablo"));
            Assert.That(result[3].FirstName, Is.EqualTo("Edvard"));
            Assert.That(result[0].AveragePaintingHeight, Is.EqualTo(34.50d));
            Assert.That(result[1].AveragePaintingHeight, Is.EqualTo(34.75d));
            Assert.That(result[2].AveragePaintingHeight, Is.EqualTo(46.25d));
            Assert.That(result[3].AveragePaintingHeight, Is.EqualTo(91.0d));
        }
    }
}
