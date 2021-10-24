using System;
using System.Collections.Generic;

namespace Backend.Api.DTOs
{
    public record MessageToAddDto(Guid SenderId, Guid ChatId, string Content,
        IEnumerable<Guid> AttachmentsIds);
}