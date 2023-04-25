using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;
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
        [HttpGet("{page}/{pageSize}")]
        public async Task<ActionResult<IEnumerable<ExhibitionDTO>>> GetExhibitionsPagination(int page = 0, int pageSize = 10)
        {
            if (_context.Exhibitions == null)
                return NotFound();

            return await _context.Exhibitions
                .Skip(page * pageSize)
                .Take(pageSize)
                .Select(x => ExhibitionToDTO(x))
                .ToListAsync();
        }

        // GET: api/Exhibitions/5/5
        [HttpGet("{mid}/{aid}")]
        public async Task<ActionResult<Exhibition>> GetExhibition(long mid, long aid)
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

            return exhibition;
        }

        // PUT: api/Exhibitions/5/5
        [HttpPut("{mid}/{aid}")]
        public async Task<IActionResult> PutExhibition(long mid, long aid, ExhibitionDTO exhibitionDTO)
        {
            if (mid != exhibitionDTO.MuseumId && aid != exhibitionDTO.ArtistId)
            {
                return BadRequest();
            }

            var exhibition = await _context.Exhibitions
               .FirstOrDefaultAsync(p => p.MuseumId == mid && p.ArtistId == aid);

            if (exhibition == null)
            {
                return NotFound();
            }

            String validationErrors = _validator.ValidateExhibition(exhibitionDTO);

            if (validationErrors != String.Empty)
            {
                return BadRequest("ERROR:\n" + validationErrors);
            }

            exhibition.ArtistId = exhibitionDTO.ArtistId;
            exhibition.MuseumId = exhibitionDTO.MuseumId;
            exhibition.StartDate = exhibitionDTO.StartDate;
            exhibition.EndDate = exhibitionDTO.EndDate;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException) when (!ExhibitionExists(mid, aid))
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

            String validationErrors = _validator.ValidateExhibition(exhibitionDTO);

            if (validationErrors != String.Empty)
            {
                return BadRequest("ERROR:\n" + validationErrors);
            }

            var exhibition = new Exhibition
            {
                ArtistId = exhibitionDTO.ArtistId,
                Artist = artist,

                MuseumId = exhibitionDTO.MuseumId,
                Museum = museum,

                StartDate = exhibitionDTO.StartDate,
                EndDate = exhibitionDTO.EndDate
            };

            _context.Exhibitions.Add(exhibition);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetExhibition), ExhibitionToDTO(exhibition));
        }

        // DELETE: api/exhibitions/5/5
        [HttpDelete("{mid}/{aid}")]
        public async Task<IActionResult> DeleteExhibition(long mid, long aid)
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

            _context.Exhibitions.Remove(exhibition);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ExhibitionExists(long mid, long aid)
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
