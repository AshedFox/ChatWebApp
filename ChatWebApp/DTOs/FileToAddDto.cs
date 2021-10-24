using System;

namespace Backend.Api.DTOs
{
    public record FileToAddDto(string Name, string Path,
        string ContentType);
}