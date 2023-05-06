using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.VisualBasic.Syntax;
using Microsoft.EntityFrameworkCore;
using MuseumAPI.Context;
using MuseumAPI.Models;
using MuseumAPI.Validation;

namespace MuseumAPI.Controllers
{
    [Route("api/Artists")]
    [ApiController]
    public class ArtistsController : ControllerBase
    {
        private readonly MuseumContext _context;
        private readonly Validate _validator;

        public ArtistsController(MuseumContext context)
        {
            _context = context;
            _validator = new Validate();
        }

        // GET: api/Artists/count/10
        [HttpGet("count/{pageSize}")]
        public async Task<int> GetTotalNumberOfPages(int pageSize = 10)
        {
            int total = await _context.Artists.CountAsync();
            int totalPages = total / pageSize;
            if (total % pageSize > 0)
                totalPages++;

            return totalPages;
        }

        // GET: api/Artists
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ArtistDTO>>> GetArtists()
        {
            if (_context.Artists == null)
            {
                return NotFound();
            }

            return await _context.Artists.Include(a => a.Paintings).Select(x => ArtistToDTO(x)).ToListAsync();
        }

        // GET: api/Artists?page=0&pageSize=10
        [HttpGet("{page}/{pageSize}")]
        public async Task<ActionResult<IEnumerable<Artist>>> GetArtistsPagination(int page = 0, int pageSize = 10)
        {
            if (_context.Artists == null)
                return NotFound();

            return await _context.Artists
                .Include(a => a.Paintings)
                .Include(a => a.Museums)
                .Include(a => a.Exhibitions)
                .Include(a => a.User)
                .Skip(page * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        // GET: api/Artists/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Artist>> GetArtist(long id)
        {
            if (_context.Artists == null)
            {
              return NotFound();
            }

            var artist = await _context.Artists
                .Include(a => a.Paintings)
                .Include(a => a.Museums)
                .Include(a => a.Exhibitions)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (artist == null)
            {
                return NotFound();
            }

            return artist;
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<ArtistDTO>>> AutocompleteName(string query)
        {

            if (_context.Artists == null)
                return NotFound();

            if (query.Length < 3)
                return NotFound();

            return await _context.Artists
                .Where(t => (t.FirstName != null  && t.FirstName.ToLower().Contains(query.ToLower())) || (t.LastName != null && t.LastName.ToLower().Contains(query.ToLower())))
                .Select(x => ArtistToDTO(x))
                .Take(10)
                .ToListAsync();
        }

        // PUT: api/Artists/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutArtist(long id, ArtistDTO artistDTO)
        {
            if (id != artistDTO.Id)
            {
                return BadRequest();
            }

            var artist = await _context.Artists.FindAsync(id);

            if (artist == null)
            {
                return NotFound();
            }

            String validationErrors = _validator.ValidateArtist(artistDTO);

            if (validationErrors != String.Empty)
            {
                return BadRequest("ERROR:\n" + validationErrors);
            }

            artist.FirstName = artistDTO.FirstName;
            artist.LastName = artistDTO.LastName;
            artist.BirthDate = artistDTO.BirthDate;
            artist.BirthPlace = artistDTO.BirthPlace;
            artist.Education = artistDTO.Education;
            artist.Movement = artistDTO.Movement;
            // artist.Paintings = artist.Paintings;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException) when (!ArtistExists(id))
            {
                if (!ArtistExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Artists
        [HttpPost]
        public async Task<ActionResult<Artist>> PostArtist(ArtistDTO artistDTO)
        {
            if (_context.Artists == null)
            {
                return Problem("Entity set 'MuseumContext.Artists' is null.");
            }

            if (artistDTO == null)
            {
                return Problem("The request body is null.");
            }

            String validationErrors = _validator.ValidateArtist(artistDTO);

            if (validationErrors != String.Empty)
            {
                return BadRequest("ERROR:\n" + validationErrors);
            }

            var artist = new Artist
            {
                FirstName = artistDTO.FirstName,
                LastName = artistDTO.LastName,
                BirthDate = artistDTO.BirthDate,
                BirthPlace = artistDTO.BirthPlace,
                Education = artistDTO.Education,
                Movement = artistDTO.Movement,
                Paintings = null!
            };

            _context.Artists.Add(artist);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetArtist), new { id = artistDTO.Id }, ArtistToDTO(artist));
        }

        // GET: Exhibition
        [HttpGet("Exhibition")]
        public async Task<ActionResult<IEnumerable<ExhibitionDTO>>> GetExhibition()
        {
            if (_context.Exhibitions == null)
            {
                return NotFound();
            }

            return await _context.Exhibitions.Select(x => ExhibitionToDTO(x)).ToListAsync();
        }

        // POST: api/Artists/id/Museums
        [HttpPost("{id}/Museums")]
        public async Task<ActionResult<ExhibitionDTO>> PostArtistWithMuseum(long id, ExhibitionDTO exhibitionDTO)
        {
            if (_context.Artists == null)
            {
                return Problem("Entity set 'MuseumContext.Artists' is null.");
            }

            var museum = await _context.Museums.FindAsync(exhibitionDTO.MuseumId);

            if (museum == null)
            {
                return BadRequest();
            }

            var artist = await _context.Artists.FindAsync(id);

            if (artist == null)
            {
                return BadRequest();
            }

            var newExhibition = new Exhibition
            {
                ArtistId = id,
                Artist = artist,
                MuseumId = exhibitionDTO.MuseumId,
                Museum = museum,
                StartDate = exhibitionDTO.StartDate,
                EndDate = exhibitionDTO.EndDate
            };

            try
            {
                _context.Exhibitions.Add(newExhibition);
                await _context.SaveChangesAsync();
            }
            catch
            {
                return BadRequest();
            }

            return CreatedAtAction(nameof(GetExhibition), ExhibitionToDTO(newExhibition));
        }

        [HttpPost("{id}/MuseumList")]
        public async Task<ActionResult<ExhibitionDTO>> PostArtistWithListOfMuseums(long id, ArtistMuseumListDTO exhibitionDTO)
        {
            if (_context.Artists == null)
            {
                return Problem("Entity set 'MuseumContext.Artists'  is null.");
            }

            var artist = await _context.Artists.FindAsync(id);
            if (artist == null)
            {
                return BadRequest();
            }

            foreach (var musId in exhibitionDTO.MuseumId)
            {
                var museum = await _context.Museums.FindAsync(musId);
                if (museum == null)
                {
                    return BadRequest();
                }

                var newEx = new Exhibition
                {
                    ArtistId = id,
                    Artist = artist,

                    MuseumId = musId,
                    Museum = museum,

                    StartDate = exhibitionDTO.StartDate,
                    EndDate = exhibitionDTO.EndDate
                };

                try
                {
                    _context.Exhibitions.Add(newEx);
                    await _context.SaveChangesAsync();
                }
                catch
                {
                    return BadRequest();
                }
            }

            return CreatedAtAction(nameof(GetExhibition), ExhibitionToDTO(new Exhibition()));
        }

        // POST: api/Artists/5/PaintingsIds
        [HttpPost("{id}/PaintingIds")]
        public async Task<IActionResult> PostPaintingsToArtist(long id, [FromBody] List<long> paintingsIds)
        {
            if (_context.Artists == null)
                return NotFound();

            var artist = await _context.Artists.FindAsync(id);

            if (artist == null)
                return NotFound();

            foreach (var paintingId in paintingsIds)
            {
                var painting = await _context.Paintings.FindAsync(paintingId);
                if (painting == null)
                    return NotFound();

                painting.ArtistId = id;
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // POST: api/Artists/5/PaintingsList
        [HttpPost("{id}/PaintingsList")]
        public async Task<ActionResult<Artist>> PostPaintingsToArtistFullObject(long id, List<PaintingDTO> paintings)
        {
            if (_context.Artists == null)
                return NotFound();

            var artist = await _context.Artists.FindAsync(id);

            if (artist == null)
                return NotFound();

            foreach (var paintingDTO in paintings)
            {
                var painting = new Painting
                {
                    Title = paintingDTO.Title,
                    CreationYear = paintingDTO.CreationYear,
                    Height = paintingDTO.Height,
                    Subject = paintingDTO.Subject,
                    Medium = paintingDTO.Medium,
                    Description = paintingDTO.Description,
                    ArtistId = id,
                };

                _context.Paintings.Add(painting);
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // PUT: api/Artists/5/PaintingsIds
        [HttpPut("{id}/PaintingsIds")]
        public async Task<IActionResult> PutPaintingsToArtist(long id, [FromBody] List<long> paintingIds)
        {
            if (_context.Artists == null)
                return NotFound();

            var artist = await _context.Artists
                .Include(x => x.Paintings)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (artist == null)
                return NotFound();

            var paintings = await _context.Paintings
                .Where(x => paintingIds.Contains(x.Id))
                .ToListAsync();

            if (paintings.Count != paintingIds.Count)
                return BadRequest();

            artist.Paintings.Clear();
            artist.Paintings = paintings;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // FILTER: api/Artists/Filter
        [HttpGet("GetByPaintingAge")]
        public async Task<List<ArtistsWithAveragePaintingAgeDTO>> GetArtistWithAveragePaintingAge()
        {
            //if (_context.Artists == null)
            //{
            //    return NotFound();
            //}

            //if (_context.Paintings == null)
            //{
            //    return NotFound();
            //}

            var a = await (from artists in _context.Artists
                           join paintings in _context.Paintings on artists.Id equals paintings.ArtistId
                           group paintings by artists into g
                           select new ArtistsWithAveragePaintingAgeDTO
                           {
                               Id = g.Key.Id,
                               FirstName = g.Key.FirstName,
                               LastName = g.Key.LastName,
                               BirthDate = g.Key.BirthDate,
                               BirthPlace = g.Key.BirthPlace,
                               Education = g.Key.Education,
                               Movement = g.Key.Movement,
                               AveragePaintingAge = g.Average(painting => DateTime.Now.Year - painting.CreationYear)
                           }
                     ).Take(100).OrderBy(dto => dto.AveragePaintingAge).ToListAsync();

            return a;
        }

        [HttpGet("GetByPaintingHeight")]
        public async Task<List<ArtistsWithAveragePaintingHeightDTO>> GetArtistWithAveragePaintingHeight()
        {
            //if (_context.Artists == null)
            //{
            //    return NotFound();
            //}

            //if (_context.Paintings == null)
            //{
            //    return NotFound();
            //}

            var a = await (from artists in _context.Artists
                           join paintings in _context.Paintings on artists.Id equals paintings.ArtistId
                           group paintings by artists into g
                           select new ArtistsWithAveragePaintingHeightDTO
                           {
                               Id = g.Key.Id,
                               FirstName = g.Key.FirstName,
                               LastName = g.Key.LastName,
                               BirthDate = g.Key.BirthDate,
                               BirthPlace = g.Key.BirthPlace,
                               Education = g.Key.Education,
                               Movement = g.Key.Movement,
                               AveragePaintingHeight = g.Average(painting => painting.Height)
                           }
                     ).Take(100).OrderBy(dto => dto.AveragePaintingHeight).ToListAsync();

            return a;
        }

        // DELETE: api/Artists/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteArtist(long id)
        {
            if (_context.Artists == null)
            {
                return NotFound();
            }

            var artist = await _context.Artists.FindAsync(id);

            if (artist == null)
            {
                return NotFound();
            }

            _context.Artists.Remove(artist);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("count-paintings")]
        public async Task<IEnumerable<int>> GetPaintingCountForArtist(int pageNumber = 0, int pageSize = 10)
        {
            var paintingsCount = await _context.Paintings
                .GroupBy(a => a.ArtistId)
                .Select(g => new { ArtistId = g.Key, paintingsCount = g.Count() })
                .OrderBy(a => a.ArtistId)
                .Skip(pageNumber * pageSize)
                .Take(pageSize)
                .Select(a => a.paintingsCount)
                .ToListAsync();

            return paintingsCount;
        }

        private bool ArtistExists(long id)
        {
            return (_context.Artists?.Any(a => a.Id == id)).GetValueOrDefault();
        }

        private static ArtistDTO ArtistToDTO(Artist artist)
        {
            return new ArtistDTO
            {
                Id = artist.Id,
                FirstName = artist.FirstName,
                LastName = artist.LastName,
                BirthDate = artist.BirthDate,
                BirthPlace = artist.BirthPlace,
                Education = artist.Education,
                Movement = artist.Movement
            };
        }

        private static ExhibitionDTO ExhibitionToDTO(Exhibition exhibition)
        {
            return new ExhibitionDTO
            {
                ArtistId = exhibition.ArtistId,
                MuseumId = exhibition.MuseumId,
                StartDate = exhibition.StartDate,
                EndDate = exhibition.EndDate
            };
        }
    }
}
