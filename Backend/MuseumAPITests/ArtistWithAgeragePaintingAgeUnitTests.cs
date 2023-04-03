using MuseumAPI.Models;
using MuseumAPI.Controllers;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using Moq.EntityFrameworkCore;
using MuseumAPI.Validation;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Reflection.Metadata;
using System.Threading.Tasks;
using static System.Reflection.Metadata.BlobBuilder;
using NUnit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using NUnit.Framework;
using MuseumAPI.Context;

namespace MuseumAPITests
{
    [TestFixture]
    public class ArtistWithAveragePaintingAgeUnitTests
    {
        private Mock<MuseumContext> _contextMock;

        [SetUp]
        public void Setup()
        {
            // create a mock of the MuseumContext
            _contextMock = new Mock<MuseumContext>();
        }

        [Test]
        public async Task GetArtistWithAveragePaintingAge_ReturnsExpectedResult()
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
                new Painting { Id = 1, Title = "The Starry Night", CreationYear = 1889, ArtistId = 1 },
                new Painting { Id = 2, Title = "Les Demoiselles d'Avignon", CreationYear = 1907, ArtistId = 2 },
                new Painting { Id = 3, Title = "Water Lilies", CreationYear = 1916, ArtistId = 3 },
                new Painting { Id = 4, Title = "Sunflowers", CreationYear = 1888, ArtistId = 1 },
                new Painting { Id = 5, Title = "Guernica", CreationYear = 1937, ArtistId = 2 },
                new Painting { Id = 6, Title = "The Scream", CreationYear = 1893, ArtistId = 4 },
                new Painting { Id = 7, Title = "The Gleaners", CreationYear = 1857, ArtistId = 3 },
                new Painting { Id = 8, Title = "The Potato Eaters", CreationYear = 1884, ArtistId = 1 },
            };

            _contextMock.Setup(c => c.Artists).ReturnsDbSet(artists);
            _contextMock.Setup(c => c.Paintings).ReturnsDbSet(paintings);

            var controller = new ArtistsController(_contextMock.Object);

            // act
            var result = await controller.GetArtistWithAveragePaintingAge();

            // assert
            Assert.That(result.Count, Is.EqualTo(4));
            Assert.That(result[0].Id, Is.EqualTo(2));
            Assert.That(result[1].Id, Is.EqualTo(4));
            Assert.That(result[2].Id, Is.EqualTo(1));
            Assert.That(result[3].Id, Is.EqualTo(3));
            Assert.That(result[0].FirstName, Is.EqualTo("Pablo"));
            Assert.That(result[1].FirstName, Is.EqualTo("Edvard"));
            Assert.That(result[2].FirstName, Is.EqualTo("Vincent"));
            Assert.That(result[3].FirstName, Is.EqualTo("Claude"));
            Assert.That(result[0].AveragePaintingAge, Is.EqualTo(101.0d));
            Assert.That(result[1].AveragePaintingAge, Is.EqualTo(130.0d));
            Assert.That(result[2].AveragePaintingAge, Is.EqualTo(136.0d));
            Assert.That(result[3].AveragePaintingAge, Is.EqualTo(136.5d));
        }
    }
}
