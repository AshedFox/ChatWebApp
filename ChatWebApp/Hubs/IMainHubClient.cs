using System;
using System.Threading.Tasks;
using ChatWebApp.DTOs;

namespace ChatWebApp.Hubs
{
    public interface IMainHubClient
    {
        Task AddChatUser(Guid chatId, UserDto user);
        Task RemoveChatUser(Guid chatId, Guid userId);
        Task ReceiveMessage(MessageDto message);
        Task AddNewChat(ChatDto chat);
        Task RemoveChat(Guid chatId);
    }
}