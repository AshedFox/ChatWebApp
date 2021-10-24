using System;

namespace Backend.Api.DTOs
{
    public record AuthResultDto(UserDto User, string AccessToken, DateTime ValidTo);
}