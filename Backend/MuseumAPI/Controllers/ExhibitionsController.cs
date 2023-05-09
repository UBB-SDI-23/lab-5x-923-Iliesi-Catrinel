using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
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
    [Route("api/Exhibitions")]
    [ApiController]
    public class ExhibitionsController : ControllerBase
    {
        private readonly MuseumContext _context;
        private readonly Validate _validator;

        public ExhibitionsController(MuseumContext context)
        {
            _context = context;
            _validator = new Validate();
        }

        // GET: api/Exhibitions/count/10
        [HttpGet("count/{pageSize}")]
        [AllowAnonymous]
        public async Task<int> GetTotalNumberOfPages(int pageSize = 10)
        {
            int total = await _context.Exhibitions.CountAsync();
            int totalPages = total / pageSize;
            if (total % pageSize > 0)
                totalPages++;

            return totalPages;
        }

        // GET: api/Exhibitions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ExhibitionDTO>>> GetExhibition()
        {
            if (_context.Exhibitions == null)
            {
                return NotFound();
            }

            return await _context.Exhibitions.Select(x => ExhibitionToDTO(x)).ToListAsync();
        }

        // GET: api/Exhibitions?page=0&pageSize=10
        [HttpGet("page/{page}/{pageSize}")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Exhibition>>> GetExhibitionsPagination(int page = 0, int pageSize = 10)
        {
            if (_context.Exhibitions == null)
                return NotFound();

            return await _context.Exhibitions
                .Include(e => e.Artist)
                .Include(e => e.Museum)
                .Include(e => e.User)
                .Skip(page * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        // GET: api/Exhibitions/5/5
        [HttpGet("{aid}/{mid}")]
        [AllowAnonymous]
        public async Task<ActionResult<Exhibition>> GetExhibition(long aid, long mid)
        {
            if (_context.Exhibitions == null)
            {
                return NotFound();
            }

            var exhibition = await _context.Exhibitions
                .Include(e => e.User)
                .Include(e => e.Artist)
                .Include(e => e.Museum)
                .FirstOrDefaultAsync(p => p.MuseumId == mid && p.ArtistId == aid);

            if (exhibition == null)
            {
                return NotFound();
            }

            return exhibition;
        }

        // PUT: api/Exhibitions/5/5
        [HttpPut("{aid}/{mid}")]
        public async Task<IActionResult> PutExhibition(long aid, long mid, ExhibitionDTO exhibitionDTO)
        {
            if (mid != exhibitionDTO.MuseumId && aid != exhibitionDTO.ArtistId)
            {
                return BadRequest();
            }

            var exhibition = await _context.Exhibitions.FindAsync(aid, mid);

            if (exhibition == null)
            {
                return NotFound();
            }

            var extracted = UsersController.ExtractJWTToken(User);
            if (extracted == null)
                return Unauthorized("Invalid token.");

            if (extracted.Item2 == AccessLevel.Regular && exhibition.UserId != extracted.Item1)
                return Unauthorized("You can only update your own entities.");

            String validationErrors = _validator.ValidateExhibition(exhibitionDTO);

            if (validationErrors != String.Empty)
            {
                return BadRequest("ERROR:\n" + validationErrors);
            }

            // search for the artist and museum
            var artist = await _context.Artists.FindAsync(aid);
            if (artist == null)
                return BadRequest();

            var museum = await _context.Museums.FindAsync(mid);
            if (museum == null)
                return BadRequest();

            exhibition.ArtistId = exhibitionDTO.ArtistId;
            exhibition.Artist = artist;

            exhibition.MuseumId = exhibitionDTO.MuseumId;
            exhibition.Museum = museum;

            exhibition.StartDate = exhibitionDTO.StartDate;
            exhibition.EndDate = exhibitionDTO.EndDate;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException) when (!ExhibitionExists(aid, mid))
            {
                if (!ExhibitionExists(mid, aid))
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
        public async Task<ActionResult<ExhibitionDTO>> PostExhibition(ExhibitionDTO exhibitionDTO)
        {
            if (_context.Exhibitions == null)
            {
                return Problem("Entity set 'MuseumContext.Exhibitions'  is null.");
            }

            var extracted = UsersController.ExtractJWTToken(User);
            if (extracted == null)
                return Unauthorized("Invalid token.");

            String validationErrors = _validator.ValidateExhibition(exhibitionDTO);

            if (validationErrors != String.Empty)
            {
                return BadRequest("ERROR:\n" + validationErrors);
            }

            var museum = await _context.Museums.FindAsync(exhibitionDTO.MuseumId);

            if (museum == null)
            {
                return BadRequest();
            }

            var artist = await _context.Artists.FindAsync(exhibitionDTO.ArtistId);

            if (artist == null)
            {
                return BadRequest();
            }

            var exhibition = new Exhibition
            {
                ArtistId = exhibitionDTO.ArtistId,
                Artist = artist,

                MuseumId = exhibitionDTO.MuseumId,
                Museum = museum,

                StartDate = exhibitionDTO.StartDate,
                EndDate = exhibitionDTO.EndDate,

                UserId = extracted.Item1
            };

            _context.Exhibitions.Add(exhibition);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException) when (ExhibitionExists(exhibition.ArtistId, exhibition.MuseumId))
            {
                return Conflict();
            }

            return CreatedAtAction(nameof(GetExhibition), new { aid = artist.Id, mid = museum.Id }, ExhibitionToDTO(exhibition));
        }

        // DELETE: api/exhibitions/5/5
        [HttpDelete("{aid}/{mid}")]
        public async Task<IActionResult> DeleteExhibition(long aid, long mid)
        {
            if (_context.Exhibitions == null)
            {
                return NotFound();
            }

            var exhibition = await _context.Exhibitions
                .Include(e => e.Artist)
                .Include(e => e.Museum)
                .FirstOrDefaultAsync(p => p.MuseumId == mid && p.ArtistId == aid);

            if (exhibition == null)
            {
                return NotFound();
            }

            var extracted = UsersController.ExtractJWTToken(User);
            if (extracted == null)
                return Unauthorized("Invalid token.");

            if (extracted.Item2 == AccessLevel.Regular && exhibition.UserId != extracted.Item1)
                return Unauthorized("You can only delete your own entities.");

            _context.Exhibitions.Remove(exhibition);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ExhibitionExists(long aid, long mid)
        {
            return (_context.Exhibitions?.Any(e => e.MuseumId == mid && e.ArtistId == aid)).GetValueOrDefault();
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
