using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ChatWebApp.DTOs;
using ChatWebApp.Models;

namespace ChatWebApp.Data
{
    public interface IMessagesRepository
    {
        public Task<Message> Create(MessageToAddDto message);
        public Task AddFile(Guid messageId, Guid fileId);
        public Task AddFilesList(Guid messageId, IEnumerable<Guid> filesIds);
        public Task RemoveFile(Guid messageId, Guid fileId);
        public Task<Message> Read(Guid id);
        public Task<IEnumerable<Message>> ReadList(Guid chatId, ulong limit = 0);
        public Task<IEnumerable<Message>> ReadListSince(Guid chatId, Guid lastMessageId, ulong limit = 0);
        public Task<Message> Update(Guid id, MessageToAddDto message);
        public Task Delete(Guid id);
    }
}