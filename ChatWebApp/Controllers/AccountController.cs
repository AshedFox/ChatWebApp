using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using ChatWebApp.Auth;
using ChatWebApp.Data;
using ChatWebApp.DTOs;
using ChatWebApp.Models;
using Isopoh.Cryptography.Argon2;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace ChatWebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IUsersRepository _usersRepository;
        private readonly IMapper _mapper;

        public AccountController(IMapper mapper, IUsersRepository usersRepository)
        {
            _mapper = mapper;
            _usersRepository = usersRepository;
        }
        
        // POST: account/register
        [HttpPost("[action]")]
        public async Task<IActionResult> Register([FromBody] UserToAddDto userToAdd)
        {
            try
            {
                if (await _usersRepository.Read(userToAdd.Email) is not null || 
                    await _usersRepository.Read(userToAdd.Username) is not null)
                {
                    return Conflict();
                }
                
                var salt = GenerateSalt(64);


                var user = await _usersRepository.Create(
                    userToAdd with { PasswordHash = GenerateArgon2Hash(userToAdd.PasswordHash, salt) }, salt);

                var jwt = GenerateToken(user);
                var accessToken  = new JwtSecurityTokenHandler().WriteToken(jwt);

                return CreatedAtAction(nameof(Register),
                    new AuthResultDto
                    (
                        _mapper.Map<User,UserDto>(user),
                        accessToken, 
                        jwt.ValidTo
                    ));            
            }
            catch (Exception e)
            {
                return Problem(e.Message);
            }
        }

        // POST: account/authorize 
        [HttpPost("[action]")]
        public async Task<IActionResult> Authorize([FromBody] LoginDto loginDto)
        {
            var user = await _usersRepository.Read(loginDto.Login);

            if (user is null)
            {
                return NotFound();
            }
            
            var argon2Config = GenerateArgon2Config(loginDto.PasswordHash, user.Salt);
            if (!Argon2.Verify(user.PasswordHash, argon2Config))
            {
                return Forbid();
            }

            var jwt = GenerateToken(user);
            var accessToken = new JwtSecurityTokenHandler().WriteToken(jwt);

            return Ok(new AuthResultDto(_mapper.Map<User, UserDto>(user), accessToken, jwt.ValidTo));
        }
        
        // DELETE: account/delete
        [HttpDelete("[action]")]
        [Authorize]
        public async Task<IActionResult> Delete(LoginDto loginDto)
        {
            try
            {
                var user = await _usersRepository.Read(loginDto.Login);
                if (user is null)
                {
                    return NotFound();
                }

                var argon2Config = GenerateArgon2Config(loginDto.PasswordHash, user.Salt);
                if (!Argon2.Verify(user.PasswordHash, argon2Config))
                {
                    return Forbid();
                }

                await _usersRepository.Delete(user.Id);
                
                return Ok();
            }
            catch (Exception e)
            {
                return Problem(e.Message);
            }
        }

        private IEnumerable<Claim> GetClaims(User user)
        {
            var claims = new Claim[]
            {
                new(ClaimTypes.NameIdentifier , user.Id.ToString()),
            };

            return claims;
        }

        private JwtSecurityToken GenerateToken(User user)
        {
            var claims = GetClaims(user);
            
            var credentials =
                new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256);
            
            var jwt = new JwtSecurityToken(
                AuthOptions.Issuer,
                AuthOptions.Audience,
                claims,
                expires: DateTime.UtcNow.AddMinutes(AuthOptions.Lifetime),
                signingCredentials: credentials
            );

            return jwt;
        }

        private string GenerateSalt(int length)
        {
            var bytes = new byte[length];
            var random = new RNGCryptoServiceProvider();
            random.GetNonZeroBytes(bytes);
            
            return Convert.ToBase64String(bytes);
        }

        private Argon2Config GenerateArgon2Config(string password, string salt)
        {
            var passwordBytes = Encoding.UTF8.GetBytes(password);
            var saltBytes = Convert.FromBase64String(salt);
            
            return new Argon2Config()
            {
                Lanes = 4,
                MemoryCost = 2048,
                Type = Argon2Type.DataIndependentAddressing,
                HashLength = 128,
                TimeCost = 20,
                Password = passwordBytes,
                Salt = saltBytes
            };
        }
        
        private string GenerateArgon2Hash(string password, string salt)
        {
            var argon2Config = GenerateArgon2Config(password, salt);

            return Argon2.Hash(argon2Config);
        }
    }
}