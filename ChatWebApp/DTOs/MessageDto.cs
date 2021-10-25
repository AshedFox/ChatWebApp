using System;
using System.Collections.Generic;

namespace ChatWebApp.DTOs
{
    public record MessageDto(Guid Id, UserDto Sender, 
        ChatDto Chat, string Content, DateTime SentAt,
        IEnumerable<FileDto> Attachments);
}