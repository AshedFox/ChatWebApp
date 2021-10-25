using System;

namespace ChatWebApp.DTOs
{
    public record AuthResultDto(UserDto User, string AccessToken, DateTime ValidTo);
}