using System;
using System.Collections.Generic;
using Backend.Api.Models;

namespace Backend.Api.DTOs
{
    public record ChatDto(Guid Id, string Name, FileDto ImageFile, 
        IEnumerable<MessageDto> Messages, IEnumerable<UserDto> Users);
}