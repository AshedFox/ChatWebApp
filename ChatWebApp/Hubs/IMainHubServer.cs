using System;
using System.Threading.Tasks;
using ChatWebApp.DTOs;

namespace ChatWebApp.Hubs
{
    public interface IMainHubServer
    {
        public Task SendMessage(MessageToAddDto messageToAdd);

        public Task CreateChat(ChatToAddDto chatToAdd);

        public Task JoinChat(Guid chatId);
        public Task LeaveChat(Guid chatId);
    }
}