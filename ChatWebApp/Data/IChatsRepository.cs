using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ChatWebApp.DTOs;
using ChatWebApp.Models;

namespace ChatWebApp.Data
{
    public interface IChatsRepository
    {
        public Task<Chat> Create(ChatToAddDto chat);
        public Task AddUser(Guid chatId, Guid userId);
        public Task<Chat> Read(Guid id);
        public Task<IEnumerable<Chat>> ReadList(string pattern="");
        public Task<IEnumerable<Chat>> ReadList(Guid userId);
        public Task<Chat> Update(Guid id, ChatToAddDto chat);
        public Task Delete(Guid id);
        public Task RemoveUser(Guid chatId, Guid userId);
    }
}