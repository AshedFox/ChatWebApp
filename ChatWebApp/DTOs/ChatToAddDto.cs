using System;

namespace Backend.Api.DTOs
{
    public record ChatToAddDto(string Name, Guid ImageFileId);
}