using System;
using System.Threading.Tasks;
using AutoMapper;
using Backend.Api.Data;
using Backend.Api.DTOs;
using Backend.Api.Models;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Backend.Api.Hubs
{
    [Authorize]
    public class MainHub: Hub<IMainHubClient>, IMainHubServer
    {
        private readonly IMapper _mapper;
        private readonly IChatsRepository _chatsRepository;
        private readonly IUsersRepository _usersRepository;
        private readonly IMessagesRepository _messagesRepository;
        private readonly IFilesRepository _filesRepository;

        public MainHub(IMapper mapper, IChatsRepository chatsRepository, 
            IUsersRepository usersRepository, IMessagesRepository messagesRepository,
            IFilesRepository filesRepository)
        {
            _mapper = mapper;
            _chatsRepository = chatsRepository;
            _usersRepository = usersRepository;
            _messagesRepository = messagesRepository;
            _filesRepository = filesRepository;
        }

        public override async Task OnConnectedAsync()
        {
            if (Guid.TryParse(Context.UserIdentifier, out var userId))
            {
                if (await _usersRepository.Read(userId) is not null)
                {
                    var chats = await _chatsRepository.ReadList(userId);
                    foreach (var chat in chats)
                    {
                        await Groups.AddToGroupAsync(Context.ConnectionId, chat.Id.ToString());
                    }
                }
            }

            await base.OnConnectedAsync();
        }

        public async Task SendMessage(MessageToAddDto messageToAdd)
        {
            var message = _mapper.Map<Message, MessageDto>(await _messagesRepository.Create(messageToAdd));
            await _messagesRepository.AddFilesList(message.Id, messageToAdd.AttachmentsIds);
            
            message = _mapper.Map<Message, MessageDto>(await _messagesRepository.Read(message.Id));
            await Clients.Group(message.Chat.Id.ToString()).ReceiveMessage(message);
        }

        public async Task CreateChat(ChatToAddDto chatToAdd)
        {
            if (!Guid.TryParse(Context.UserIdentifier, out var userId))
            {
                return;
            }

            var chatId = (await _chatsRepository.Create(chatToAdd)).Id;
            await _chatsRepository.AddUser(chatId, userId);
            var chat = _mapper.Map<Chat,ChatDto>(await _chatsRepository.Read(chatId));

            await Groups.AddToGroupAsync(Context.ConnectionId, chat.Id.ToString());
            await Clients.User(userId.ToString()).AddNewChat(chat); 
        }

        public async Task JoinChat(Guid chatId)
        {
            if (Guid.TryParse(Context.UserIdentifier, out var userId))
            {
                return;
            }
            
            await _chatsRepository.AddUser(chatId, userId);
            var chat = _mapper.Map<Chat, ChatDto>(await _chatsRepository.Read(chatId));
            var user = _mapper.Map<User, UserDto>(await _usersRepository.Read(userId));
            
            await Groups.AddToGroupAsync(Context.ConnectionId, chatId.ToString());
            await Clients.User(userId.ToString()).AddNewChat(chat);
            await Clients.Group(chatId.ToString()).AddChatUser(chatId, user);
        }

        public async Task LeaveChat(Guid chatId)
        {
            if (Guid.TryParse(Context.UserIdentifier, out var userId))
            {
                return;
            }
            
            await _chatsRepository.RemoveUser(chatId, userId);
            
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, chatId.ToString());
            await Clients.User(userId.ToString()).RemoveChat(chatId);
            await Clients.Group(chatId.ToString()).RemoveChatUser(chatId, userId);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            if (Guid.TryParse(Context.UserIdentifier, out var userId))
            {
                if (await _usersRepository.Read(userId) is not null)
                {
                    var chats = await _chatsRepository.ReadList(userId);
                    foreach (var chat in chats)
                    {
                        await Groups.RemoveFromGroupAsync(Context.ConnectionId, chat.Id.ToString());
                    }
                }
            }

            await base.OnDisconnectedAsync(exception);
        }
    }
}