using System;
using System.Collections.Generic;

namespace ChatWebApp.DTOs
{
    public record ChatDto(Guid Id, string Name, FileDto ImageFile, 
        IEnumerable<MessageDto> Messages, IEnumerable<UserDto> Users);
}