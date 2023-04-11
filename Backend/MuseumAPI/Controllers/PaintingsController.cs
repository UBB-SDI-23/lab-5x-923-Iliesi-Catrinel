using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MuseumAPI.Context;
using MuseumAPI.Models;
using MuseumAPI.Validation;

namespace MuseumAPI.Controllers
{
    [Route("api/Paintings")]
    [ApiController]
    public class PaintingsController : ControllerBase
    {
        private readonly MuseumContext _context;
        private readonly Validate _validator;

        public PaintingsController(MuseumContext context)
        {
            _context = context;
            _validator = new Validate();
        }

        // GET: api/Paintings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaintingDTO>>> GetPaintings()
        {
            if (_context.Paintings == null)
            {
                return NotFound();
            }

            return await _context.Paintings.Select(x => PaintingToDTO(x)).ToListAsync();
        }

        // GET: api/Paintings/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Painting>> GetPainting(long id)
        {
            if (_context.Paintings == null)
            {
                return NotFound();
            }

            // var painting = await _context.Paintings.FindAsync(id);
            var painting = await _context.Paintings
                .Include(p => p.Artist)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (painting == null)
            {
                return NotFound();
            }

            return painting;
        }

        // PUT: api/Paintings/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPainting(long id, PaintingDTO paintingDTO)
        {
            if (id != paintingDTO.Id)
            {
                return BadRequest();
            }

            var painting = await _context.Paintings.FindAsync(id);

            if (painting == null)
            { 
                return NotFound();
            }

            // Search for artist id and return BadRequest if invalid
            var artist = await _context.Artists.FindAsync(paintingDTO.ArtistId);

            if (artist == null)
            {
                return BadRequest();
            }

            String validationErrors = _validator.validatePainting(paintingDTO);

            if (validationErrors != String.Empty)
            {
                return BadRequest("ERROR:\n" + validationErrors);
            }

            painting.Title = paintingDTO.Title;
            painting.CreationYear = paintingDTO.CreationYear;
            painting.Height = paintingDTO.Height;
            painting.Subject = paintingDTO.Subject;
            painting.Medium = paintingDTO.Medium;
            painting.Description = paintingDTO.Description;

            painting.ArtistId = paintingDTO.ArtistId;
            painting.Artist = artist;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException) when (!PaintingExists(id))
            {
                if (!PaintingExists(id))
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

        // POST: api/Paintings
        [HttpPost]
        public async Task<ActionResult<PaintingDTO>> PostPainting(PaintingDTO paintingDTO)
        {
            if (_context.Paintings == null)
            {
                return Problem("Entity set 'MuseumContext.Paintings'  is null.");
            }

            // Search for artist id and return BadRequest if invalid
            var artist = await _context.Artists.FindAsync(paintingDTO.ArtistId);

            if (artist == null)
            {
                return BadRequest();
            }

            String validationErrors = _validator.validatePainting(paintingDTO);

            if (validationErrors != String.Empty)
            {
                return BadRequest("ERROR:\n" + validationErrors);
            }

            var painting = new Painting
            {
                Title = paintingDTO.Title,
                CreationYear = paintingDTO.CreationYear,
                Subject = paintingDTO.Subject,
                Medium = paintingDTO.Medium,
                Description = paintingDTO.Description,

                ArtistId = paintingDTO.ArtistId,
                Artist = artist,
            };

            _context.Paintings.Add(painting);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPainting), new { id = painting.Id }, PaintingToDTO(painting));
        }

        // DELETE: api/Paintings/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePainting(long id)
        {
            if (_context.Paintings == null)
            {
                return NotFound();
            }

            var painting = await _context.Paintings.FindAsync(id);

            if (painting == null)
            {
                return NotFound();
            }

            _context.Paintings.Remove(painting);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // FILTER: api/Paintings/Filter?year=1800
        [HttpGet("Filter")]
        public async Task<ActionResult<IEnumerable<PaintingDTO>>> GetPaintingsByCreationYear(int year)
        {
            if (_context.Paintings == null)
            {
                return NotFound();
            }

            return await _context.Paintings.Where(x => x.CreationYear > year).Select(x => PaintingToDTO(x)).ToListAsync();
        }

        private bool PaintingExists(long id)
        {
            return (_context.Paintings?.Any(p => p.Id == id)).GetValueOrDefault();
        }

        private static PaintingDTO PaintingToDTO(Painting painting)
        {
            return new PaintingDTO
            {
                Id = painting.Id,
                Title = painting.Title,
                CreationYear = painting.CreationYear,
                Height = painting.Height,
                Subject = painting.Subject,
                Medium = painting.Medium,
                Description = painting.Description,

                ArtistId = painting.ArtistId,
            };
        }
    }
}
