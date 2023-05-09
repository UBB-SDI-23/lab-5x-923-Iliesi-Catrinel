using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
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
    [Route("api/Museums")]
    [ApiController]
    public class MuseumsController : ControllerBase
    {
        private readonly MuseumContext _context;
        private readonly Validate _validator;

        public MuseumsController(MuseumContext context)
        {
            _context = context;
            _validator = new Validate();
        }

        // GET: api/Stores/count/10
        [HttpGet("count/{pageSize}")]
        [AllowAnonymous]
        public async Task<int> GetTotalNumberOfPages(int pageSize = 10)
        {
            int total = await _context.Museums.CountAsync();
            int totalPages = total / pageSize;
            if (total % pageSize > 0)
                totalPages++;

            return totalPages;
        }

        // GET: api/Museums
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MuseumDTO>>> GetMuseums()
        {
            if (_context.Museums == null)
            {
                return NotFound();
            }

            return await _context.Museums.Select(x => MuseumToDTO(x)).ToListAsync();
        }

        // GET: api/Museums?page=0&pageSize=10
        [HttpGet("{page}/{pageSize}")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Museum>>> GetMuseumsPagination(int page = 0, int pageSize = 10)
        {
            if (_context.Museums == null)
                return NotFound();

            return await _context.Museums
                .Include(m => m.Artists)
                .Include(m => m.Exhibitions)
                .Include(m => m.User)
                .Skip(page * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        // GET: api/Museums/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<Museum>> GetMuseum(long id)
        {
            if (_context.Museums == null)
            {
                return NotFound();
            }

            var museum = await _context.Museums
                .Include(a => a.User)
                .Include(a => a.Artists)
                .Include(a => a.Exhibitions)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (museum == null)
            {
                return NotFound();
            }

            return museum;
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<MuseumDTO>>> AutocompleteName(string query)
        {

            if (_context.Museums == null)
                return NotFound();

            if (query.Length < 3)
                return NotFound();

            return await _context.Museums.Where(t => t.Name != null && t.Name.ToLower().Contains(query.ToLower()))
                .Select(x => MuseumToDTO(x))
                .Take(10)
                .ToListAsync();
        }

        // PUT: api/Museums/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMuseum(long id, MuseumDTO museumDTO)
        {
            if (id != museumDTO.Id)
            {
                return BadRequest();
            }

            var museum = await _context.Museums.FindAsync(id);

            if (museum == null)
            {
                return NotFound();
            }

            var extracted = UsersController.ExtractJWTToken(User);
            if (extracted == null)
                return Unauthorized("Invalid token.");

            if (extracted.Item2 == AccessLevel.Regular && museum.UserId != extracted.Item1)
                return Unauthorized("You can only update your own entities.");

            String validationErrors = _validator.ValidateMuseum(museumDTO);

            if (validationErrors != String.Empty)
            {
                return BadRequest("ERROR:\n" + validationErrors);
            }

            museum.Name = museumDTO.Name;
            museum.Address = museumDTO.Address;
            museum.FoundationDate = museumDTO.FoundationDate;
            museum.Architect = museumDTO.Architect;
            museum.Website = museumDTO.Website;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException) when (!MuseumExists(id))
            {
                if (!MuseumExists(id))
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

        // POST: api/Museums
        [HttpPost]
        public async Task<ActionResult<Museum>> PostMuseum(MuseumDTO museumDTO)
        {
            if (_context.Museums == null)
            {
                return Problem("Entity set 'MuseumContext.Museums'  is null.");
            }

            var extracted = UsersController.ExtractJWTToken(User);
            if (extracted == null)
                return Unauthorized("Invalid token.");

            if (museumDTO == null)
            {
                return Problem("The request body is null.");
            }

            String validationErrors = _validator.ValidateMuseum(museumDTO);

            if (validationErrors != String.Empty)
            {
                return BadRequest("ERROR:\n" + validationErrors);
            }

            var museum = new Museum
            {
                Name = museumDTO.Name,
                Address = museumDTO.Address,
                FoundationDate = museumDTO.FoundationDate,
                Architect = museumDTO.Architect,
                Website = museumDTO.Website,

                UserId = extracted.Item1
            };

            _context.Museums.Add(museum);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMuseum), new { id = museumDTO.Id }, MuseumToDTO(museum));
        }

        // DELETE: api/Museums/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMuseum(long id)
        {
            if (_context.Museums == null)
            {
                return NotFound();
            }

            var museum = await _context.Museums.FindAsync(id);

            if (museum == null)
            {
                return NotFound();
            }

            var extracted = UsersController.ExtractJWTToken(User);
            if (extracted == null)
                return Unauthorized("Invalid token.");

            if (extracted.Item2 == AccessLevel.Regular && museum.UserId != extracted.Item1)
                return Unauthorized("You can only delete your own entities.");

            _context.Museums.Remove(museum);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MuseumExists(long id)
        {
            return (_context.Museums?.Any(e => e.Id == id)).GetValueOrDefault();
        }

        private static MuseumDTO MuseumToDTO(Museum museum)
        {
            return new MuseumDTO
            {
                Id = museum.Id,
                Name = museum.Name,
                Address = museum.Address,
                FoundationDate = museum.FoundationDate,
                Architect = museum.Architect,
                Website = museum.Website
            };
        }
    }
}
