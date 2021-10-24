using System.ComponentModel.DataAnnotations;

namespace Backend.Api.DTOs
{
    public record LoginDto(string Login, string PasswordHash);
}  