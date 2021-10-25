using System;
using System.Collections.Generic;

namespace ChatWebApp.DTOs
{
    public record MessageToAddDto(Guid SenderId, Guid ChatId, string Content,
        IEnumerable<Guid> AttachmentsIds);
}