using System;
using System.Threading.Tasks;
using Backend.Api.DTOs;
using Backend.Api.Models;
using Microsoft.AspNetCore.SignalR;

namespace Backend.Api.Hubs
{
    public interface IMainHubServer
    {
        public Task SendMessage(MessageToAddDto messageToAdd);

        public Task CreateChat(ChatToAddDto chatToAdd);

        public Task JoinChat(Guid chatId);
        public Task LeaveChat(Guid chatId);
    }
}