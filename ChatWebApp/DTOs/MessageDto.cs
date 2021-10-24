using System;
using System.Collections.Generic;

namespace Backend.Api.DTOs
{
    public record MessageDto(Guid Id, UserDto Sender, 
        ChatDto Chat, string Content, DateTime SentAt,
        IEnumerable<FileDto> Attachments);
}