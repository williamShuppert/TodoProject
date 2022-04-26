using API.Models;
using DataAccess;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IDbContext _db;
        private readonly Settings _settings;

        public AuthController(IDbContext db, Settings settings)
        {
            _db = db;
            _settings = settings;
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register(Credentials register)
        {
            var attempt = (await _db.Query<LoginAttempt, Credentials>("spAddUser", register)).First();

            if (!attempt.Success)
                return BadRequest(attempt.Message);

            return Ok(new { token = GenerateJwtToken(AssembleClaimsIdentity(attempt.Id)) });
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login(Credentials login)
        {
            var attempt = (await _db.Query<LoginAttempt, Credentials>("spLogin", login)).First();

            if (!attempt.Success)
                return Forbid(attempt.Message);

            return Ok(new { token = GenerateJwtToken(AssembleClaimsIdentity(attempt.Id)) });
        }

        [HttpPost("Logout")]
        public async Task<IActionResult> Logout()
        {
            return Ok();
        }

        private List<Claim> AssembleClaimsIdentity(int id)
        {
            List<Claim> subject = new List<Claim>
            {
                new Claim("Id", id.ToString()),
                new Claim(ClaimTypes.Name, "Name")
            };
            return subject;
        }

        private string GenerateJwtToken(List<Claim> subject)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_settings.BearerKey);

            var token = new JwtSecurityToken
            (
                claims: subject,
                expires: DateTime.Now.AddDays(7),
                signingCredentials: new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
}
