using System;

namespace Backend.Api.DTOs
{
    public record FileDto(Guid Id, string Name, string Path,
        string ContentType);
}