using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Data.SqlClient;
using MuseumAPI.Attributes;
using MuseumAPI.Context;
using MuseumAPI.Models;
using MuseumAPI.Utils;
using MuseumAPI.Validation;

namespace MuseumAPI.Controllers
{
    [Route("api/Users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly MuseumContext _context;
        private readonly JwtSettings _jwtSettings;
        private readonly UserValidator _validator;

        public UsersController(MuseumContext context, IOptions<JwtSettings> jwtSettings)
        {
            _context = context;
            _jwtSettings = jwtSettings.Value;
            _validator = new UserValidator();
        }

        public static string HashPassword(string password)
        {
            byte[] hashBytes = SHA256.HashData(Encoding.UTF8.GetBytes(password));
            return BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
        }

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Role, user.AccessLevel.ToString())
                }),
                Expires = DateTime.UtcNow.AddHours(2),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private static string GenerateRandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, length).Select(s => s[random.Next(s.Length)]).ToArray());
        }

        private async Task<ConfirmationCode> GenerateConfirmationCode(User user)
        {
            string code = string.Empty;
            bool exists = true;

            while (exists)
            {
                code = GenerateRandomString(8);
                exists = await _context.ConfirmationCodes.AnyAsync(cc => cc.Code == code);
            }

            var confirmationCode = new ConfirmationCode
            {
                UserId = user.Id,
                Code = code,
                Expiration = DateTime.UtcNow.AddMinutes(10),
                Used = false
            };

            _context.ConfirmationCodes.Add(confirmationCode);
            await _context.SaveChangesAsync();

            return confirmationCode;
        }

        // POST: api/Users/register
        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<ActionResult<dynamic>> Register(UserRegisterDTO userRegisterDTO)
        {
            var validationResult = _validator.ValidateRegister(userRegisterDTO);
            if (validationResult != string.Empty)
                return BadRequest(validationResult);

            if (await _context.Users.AnyAsync(u => u.Name == userRegisterDTO.Name))
                return BadRequest("Username already exists");

            var user = new User
            {
                Name = userRegisterDTO.Name,
                Password = HashPassword(userRegisterDTO.Password!),

                UserProfile = new UserProfile
                {
                    Bio = userRegisterDTO.Bio,
                    Location = userRegisterDTO.Location,
                    Birthday = userRegisterDTO.Birthday,
                    Gender = userRegisterDTO.Gender,
                    MaritalStatus = userRegisterDTO.MaritalStatus
                }
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var userDTO = UserToDTO(user);
            userDTO.Password = null;

            var confirmationCode = await GenerateConfirmationCode(user);

            return new
            {
                user = userDTO,
                token = confirmationCode.Code,
                expiration = confirmationCode.Expiration
            };
        }

        // POST: api/Users/register/confirm
        [HttpPost("register/confirm/{code}")]
        [AllowAnonymous]
        public async Task<ActionResult> ConfirmAccount(string code)
        {
            var confirmationCode = await _context.ConfirmationCodes
                .SingleOrDefaultAsync(cc => cc.Code == code);
            if (confirmationCode == null)
                return BadRequest("Invalid confirmation code.");

            if (confirmationCode.Used)
                return BadRequest("Confirmation code has already been used.");
            if (confirmationCode.Expiration < DateTime.UtcNow)
                return BadRequest("Confirmation code has expired.");

            var user = await _context.Users.FindAsync(confirmationCode.UserId);
            if (user == null)
                return BadRequest("Invalid confirmation code.");

            if (user.AccessLevel > 0)
                return BadRequest("Account has already been confirmed.");

            user.AccessLevel = AccessLevel.Regular;
            confirmationCode.Used = true;
            await _context.SaveChangesAsync();

            return Ok("Account successfully confirmed.");
        }

        // POST: api/Users/login
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<dynamic>> Login(UserDTO userDTO)
        {
            if (userDTO.Name == null || userDTO.Password == null)
                return BadRequest();

            var hashedPassword = HashPassword(userDTO.Password);
            var user = await _context.Users
                .Include(u => u.UserProfile)
                .SingleOrDefaultAsync(u => u.Name == userDTO.Name && u.Password != null && u.Password == hashedPassword);
            if (user == null)
                return Unauthorized("Invalid username or password");

            // Check if user is confirmed
            if (user.AccessLevel == 0)
                return Unauthorized("User is not confirmed");

            var token = GenerateJwtToken(user);
            user.Password = null;

            return new
            {
                user,
                token
            };
        }

        // GET: api/Users/count/10
        [HttpGet("count/{pageSize}")]
        [Role(AccessLevel.Admin)]
        public async Task<int> GetTotalNumberOfPages(int pageSize = 10)
        {
            int total = await _context.Users.CountAsync();
            int totalPages = total / pageSize;
            if (total % pageSize > 0)
                totalPages++;

            return totalPages;
        }

        // GET: api/Users/0/10
        [HttpGet("{page}/{pageSize}")]
        [Role(AccessLevel.Admin)]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers(int page = 0, int pageSize = 10)
        {
            if (_context.Users == null)
                return NotFound();

            return await _context.Users
                .Include(x => x.UserProfile)
                .Skip(page * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        // PATCH: api/Users/0/PagePreference/5
        [HttpPatch("{id}/PagePreference/{pref}")]
        public async Task<ActionResult<UserDTO>> PatchPreference(long id, long pref)
        {
            if (_context.Users == null)
                return NotFound();

            var user = await _context.Users
                .Include(x => x.UserProfile)
                .FirstOrDefaultAsync(x => x.Id == id);
            if (user == null)
                return NotFound();

            var extracted = ExtractJWTToken(User);
            if (extracted == null)
                return Unauthorized("Invalid token.");

            if (extracted.Item2 < AccessLevel.Admin && user.Id != extracted.Item1)
                return Unauthorized("You can only update your own preferences.");

            user.UserProfile.PagePreference = pref;
            await _context.SaveChangesAsync();

            var userDTO = UserToDTO(user);
            userDTO.Password = null;

            return userDTO;
        }

        // PATCH: api/Users/0/PagePreference/5
        [HttpPatch("PagePreferences/{pref}")]
        [Role(AccessLevel.Admin)]
        public async Task<ActionResult<UserDTO>> PatchPreferences(long pref)
        {
            if (_context.UserProfiles == null)
                return NotFound();

            if (pref < 0 || pref > 100)
                return BadRequest("Preference must be between 0 and 100.");

            long count = await _context.UserProfiles
                .CountAsync();

            var parameter = new SqlParameter("@PagePreference", pref);
            await _context.Database.ExecuteSqlRawAsync("UPDATE [UserProfiles] SET [PagePreference] = @PagePreference", parameter);

            return Ok($"Updated {count} users with the new preference.");
        }

        // PATCH: api/Users/0/AccessLevel/5
        [HttpPatch("{id}/AccessLevel/{accessLevel}")]
        [Role(AccessLevel.Admin)]
        public async Task<ActionResult<UserDTO>> PatchAccessLevel(long id, AccessLevel accessLevel)
        {
            if (_context.Users == null)
                return NotFound();

            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.Id == id);
            if (user == null)
                return NotFound();

            user.AccessLevel = accessLevel;
            await _context.SaveChangesAsync();

            var userDTO = UserToDTO(user);
            userDTO.Password = null;

            return userDTO;
        }

        // GET: api/Users
        [HttpGet]
        [Role(AccessLevel.Admin)]
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetUsers()
        {
            if (_context.Users == null)
                return NotFound();

            return await _context.Users
                .Select(x => UserToDTO(x))
                .ToListAsync();
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<UserProfileDTO>> GetUser(long id)
        {
            if (_context.Users == null)
                return NotFound();

            var user = await _context.Users
                .Include(x => x.UserProfile)
                .FirstOrDefaultAsync(x => x.Id == id);
            //.FindAsync(id);
            if (user == null)
                return NotFound();

            int artistCount = await _context.Artists
                .Where(x => x.UserId == id)
                .CountAsync();

            int paintingCount = await _context.Paintings
                .Where(x => x.UserId == id)
                .CountAsync();

            int museumCount = await _context.Museums
                .Where(x => x.UserId == id)
                .CountAsync();

            int exhibitionCount = await _context.Exhibitions
                .Where(x => x.UserId == id)
                .CountAsync();

            var userProfileDTO = new UserProfileDTO
            {
                Id = user.Id,
                Name = user.Name,
                Password = null,

                AccessLevel = user.AccessLevel,
                UserProfile = user.UserProfile,

                ArtistCount = artistCount,
                PaintingCount = paintingCount,
                MuseumCount = museumCount,
                ExhibitionCount = exhibitionCount
            };

            return userProfileDTO;
        }

        // GET: api/Users/search?query=johndoe
        [HttpGet("search")]
        [Role(AccessLevel.Admin)]
        public async Task<ActionResult<IEnumerable<UserDTO>>> SearchUsers(string query)
        {
            if (_context.Users == null)
                return NotFound();

            if (query.Length < 3)
                return NotFound();

            return await _context.Users
                .Where(x => x.Name != null && x.Name.ToLower().Contains(query.ToLower()))
                .Select(x => UserToDTO(x))
                .Take(100)
                .ToListAsync();
        }

        // PUT: api/Users/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [Role(AccessLevel.Admin)]
        public async Task<IActionResult> PutUser(long id, UserDTO userDTO)
        {
            if (id != userDTO.Id)
                return BadRequest();

            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            user.Name = userDTO.Name;
            user.Password = userDTO.Password;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException) when (!UserExists(id))
            {
                return NotFound();
            }

            return NoContent();
        }

        // POST: api/Users
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Role(AccessLevel.Admin)]
        public async Task<ActionResult<UserDTO>> PostUser(UserDTO userDTO)
        {
            if (_context.Users == null)
                return Problem("Entity set 'StoreContext.Users' is null.");

            var user = new User
            {
                Name = userDTO.Name,
                Password = userDTO.Password,
                AccessLevel = AccessLevel.Unconfirmed,

                UserProfile = new UserProfile
                {

                },
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetUser),
                new { id = user.Id },
                UserToDTO(user));
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        [Role(AccessLevel.Admin)]
        public async Task<IActionResult> DeleteUser(long id)
        {
            if (_context.Users == null)
                return NotFound();

            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Users/Artists
        [HttpDelete("Artists/{count}")]
        [Role(AccessLevel.Admin)]
        public async Task<IActionResult> DeleteArtists(int count)
        {
            // add count as sql parameter
            var parameter = new SqlParameter("@Count", count);

            await _context.Database.ExecuteSqlRawAsync("DELETE TOP(@Count) FROM [Artists]", parameter);
            return Ok($"Deleted {count} artists.");
        }

        // DELETE: api/Users/Paintings
        [HttpDelete("Paintings/{count}")]
        [Role(AccessLevel.Admin)]
        public async Task<IActionResult> DeletePaintings(int count)
        {
            var parameter = new SqlParameter("@Count", count);

            await _context.Database.ExecuteSqlRawAsync("DELETE TOP(@Count) FROM [Paintings]", parameter);
            return Ok($"Deleted {count} paintings.");
        }

        // DELETE: api/Users/Museums
        [HttpDelete("Museums/{count}")]
        [Role(AccessLevel.Admin)]
        public async Task<IActionResult> DeleteStores(int count)
        {
            var parameter = new SqlParameter("@Count", count);

            await _context.Database.ExecuteSqlRawAsync("DELETE TOP(@Count) FROM [Museums]", parameter);
            return Ok($"Deleted {count} museums.");
        }

        // DELETE: api/Users/Exhibitions
        [HttpDelete("Exhibitions/{count}")]
        [Role(AccessLevel.Admin)]
        public async Task<IActionResult> DeleteExhibitions(int count)
        {
            var parameter = new SqlParameter("@Count", count);

            await _context.Database.ExecuteSqlRawAsync("DELETE TOP(@Count) FROM [Exhibitions]", parameter);
            return Ok($"Deleted {count} exhibitions.");
        }

        // POST: api/Users/Artists/5
        [HttpPost("Artists/{count}")]
        [Role(AccessLevel.Admin)]
        public async Task<IActionResult> SeedArtists(int count)
        {
            var extracted = ExtractJWTToken(User);
            if (extracted == null)
                return Unauthorized("Invalid token.");

            await SeedData.SeedArtistsAsync(_context, count, extracted.Item1);
            return Ok($"Generated {count} artists.");
        }

        // POST: api/Users/Paintings/5
        [HttpPost("Paintings/{count}")]
        [Role(AccessLevel.Admin)]
        public async Task<IActionResult> SeedPaintings(int count)
        {
            var extracted = ExtractJWTToken(User);
            if (extracted == null)
                return Unauthorized("Invalid token.");

            await SeedData.SeedPaintingsAsync(_context, count, extracted.Item1);
            return Ok($"Generated {count} paintings.");
        }

        // POST: api/Users/Museums/5
        [HttpPost("Museums/{count}")]
        [Role(AccessLevel.Admin)]
        public async Task<IActionResult> SeedMuseums(int count)
        {
            var extracted = ExtractJWTToken(User);
            if (extracted == null)
                return Unauthorized("Invalid token.");

            await SeedData.SeedMuseumsAsync(_context, count, extracted.Item1);
            return Ok($"Generated {count} museums.");
        }

        // POST: api/Users/Exhibitions/5
        [HttpPost("Exhibitions/{count}")]
        [Role(AccessLevel.Admin)]
        public async Task<IActionResult> SeedExhibitions(int count)
        {
            var extracted = ExtractJWTToken(User);
            if (extracted == null)
                return Unauthorized("Invalid token.");

            await SeedData.SeedExhibitionsAsync(_context, count, extracted.Item1);
            return Ok($"Generated {count} exhibitions.");
        }

        private bool UserExists(long id)
        {
            return _context.Users.Any(e => e.Id == id);
        }

        private static UserDTO UserToDTO(User user)
        {
            return new UserDTO
            {
                Id = user.Id,
                Name = user.Name,
                Password = user.Password,
            };
        }

        public static Tuple<long, AccessLevel>? ExtractJWTToken(ClaimsPrincipal claimsPrincipal)
        {
            var userIdClaim = claimsPrincipal.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !long.TryParse(userIdClaim.Value, out long userId))
                return null;

            var accessLevelClaim = claimsPrincipal.FindFirst(ClaimTypes.Role);
            if (accessLevelClaim == null || !Enum.TryParse<AccessLevel>(accessLevelClaim.Value, out var userAccessLevel))
                return null;

            return new Tuple<long, AccessLevel>(userId, userAccessLevel);
        }
    }
}