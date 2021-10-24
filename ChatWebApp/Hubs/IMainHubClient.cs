using System;
using System.Threading.Tasks;
using Backend.Api.DTOs;
using Backend.Api.Models;
using Microsoft.AspNetCore.SignalR;

namespace Backend.Api.Hubs
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