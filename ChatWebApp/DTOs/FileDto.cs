using System;

namespace ChatWebApp.DTOs
{
    public record FileDto(Guid Id, string Name, string Path,
        string ContentType);
}