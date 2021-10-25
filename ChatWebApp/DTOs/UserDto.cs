using System;
using System.Collections.Generic;

namespace ChatWebApp.DTOs
{
    public record UserDto(Guid Id, string Username, string Email, 
        string Name, DateTime CreatedAt, FileDto ImageFile,
        IEnumerable<ChatDto> Chats);
}