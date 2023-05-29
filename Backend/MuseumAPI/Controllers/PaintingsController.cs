using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
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

        // GET: api/Paintings/count/10
        [HttpGet("count/{pageSize}")]
        [AllowAnonymous]
        public async Task<int> GetTotalNumberOfPages(int pageSize = 10)
        {
            int total = await _context.Paintings.CountAsync();
            int totalPages = total / pageSize;
            if (total % pageSize > 0)
                totalPages++;

            return totalPages;
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

        // GET: api/Paintings?page=0&pageSize=10
        [HttpGet("{page}/{pageSize}")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Painting>>> GetPaintingPagination(int page = 0, int pageSize = 10)
        {
            if (_context.Paintings == null)
                return NotFound();

            return await _context.Paintings
                .Include(p => p.Artist)
                .Include(x => x.User)
                .Skip(page * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        // GET: api/Paintings/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<Painting>> GetPainting(long id)
        {
            if (_context.Paintings == null)
            {
                return NotFound();
            }

            var painting = await _context.Paintings
                .Include(p => p.User)
                .Include(p => p.Artist)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (painting == null)
            {
                return NotFound();
            }

            return painting;
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<PaintingDTO>>> AutocompleteTitle(string query)
        {

            if (_context.Paintings == null)
                return NotFound();

            if (query.Length < 3)
                return NotFound();

            return await _context.Paintings.Where(t => t.Title != null && t.Title.ToLower().Contains(query.ToLower()))
                .Select(x => PaintingToDTO(x))
                .Take(10)
                .ToListAsync();
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

            var extracted = UsersController.ExtractJWTToken(User);
            if (extracted == null)
                return Unauthorized("Invalid token.");

            if (extracted.Item2 == AccessLevel.Regular && painting.UserId != extracted.Item1)
                return Unauthorized("You can only update your own entities.");

            String validationErrors = _validator.ValidatePainting(paintingDTO);

            if (validationErrors != String.Empty)
            {
                return BadRequest("ERROR:\n" + validationErrors);
            }

            // Search for artist id and return BadRequest if invalid
            var artist = await _context.Artists.FindAsync(paintingDTO.ArtistId);

            if (artist == null)
            {
                return BadRequest();
            }

            painting.Title = paintingDTO.Title;
            painting.CreationYear = paintingDTO.CreationYear;
            painting.Height = paintingDTO.Height;
            painting.Subject = paintingDTO.Subject;
            painting.Medium = paintingDTO.Medium;
            painting.Description = paintingDTO.Description;
            painting.Price = paintingDTO.Price;

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

            var extracted = UsersController.ExtractJWTToken(User);
            if (extracted == null)
                return Unauthorized("Invalid token.");

            String validationErrors = _validator.ValidatePainting(paintingDTO);

            if (validationErrors != String.Empty)
            {
                return BadRequest("ERROR:\n" + validationErrors);
            }

            // Search for artist id and return BadRequest if invalid
            var artist = await _context.Artists.FindAsync(paintingDTO.ArtistId);

            if (artist == null)
            {
                return BadRequest();
            }

            var painting = new Painting
            {
                Title = paintingDTO.Title,
                CreationYear = paintingDTO.CreationYear,
                Subject = paintingDTO.Subject,
                Medium = paintingDTO.Medium,
                Description = paintingDTO.Description,
                Price = paintingDTO.Price,

                ArtistId = paintingDTO.ArtistId,
                Artist = artist,

                UserId = extracted.Item1
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

            var extracted = UsersController.ExtractJWTToken(User);
            if (extracted == null)
                return Unauthorized("Invalid token.");

            if (extracted.Item2 == AccessLevel.Regular && painting.UserId != extracted.Item1)
                return Unauthorized("You can only delete your own entities.");

            _context.Paintings.Remove(painting);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // FILTER: api/Paintings/Filter?year=1800
        [HttpGet("Filter")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Painting>>> GetPaintingsByCreationYear(int year)
        {
            if (_context.Paintings == null)
            {
                return NotFound();
            }

            return await _context.Paintings
                .Include(p => p.Artist)
                .Where(x => x.CreationYear > year)
                .Take(100)
                .ToListAsync();
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
                Price = painting.Price,

                ArtistId = painting.ArtistId,
            };
        }
    }
}
