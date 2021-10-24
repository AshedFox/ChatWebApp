using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Api.DTOs;
using Backend.Api.Models;
using Dapper;
using Npgsql;

namespace Backend.Api.Data
{
    public class ChatsRepository : IChatsRepository
    {
        public ChatsRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        private readonly string _connectionString;
        
        public async Task<Chat> Create(ChatToAddDto chatToAddDto)
        {
            var sql = 
                $"insert into chats(name, image_file_id) values (@Name, @ImageFileId) " + 
                $"returning *;";

            await using var connection = new NpgsqlConnection(_connectionString);
            return await connection.QueryFirstAsync<Chat>(sql, chatToAddDto);
        }

        public async Task AddUser(Guid chatId, Guid userId)
        {
            var sql = 
                "insert into chats_users(chat_id, user_id) VALUES (@chatId, @userId);";
            
            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.ExecuteAsync(sql, new { chatId, userId });
        }

        public async Task<Chat> Read(Guid id)
        {
            var sql =
                $"select * from chats c " + 
                $"inner join chats_users cu on c.id = cu.chat_id " + 
                $"left join messages m on m.chat_id = c.id " +
                $"left join users u1 on m.sender_id = u1.id " +
                $"left join files uf on uf.id = u1.image_file_id " +
                $"left join messages_files ma on ma.message_id = m.id " +
                $"left join files a on a.id = ma.file_id " +
                $"inner join users u2 on u2.id = cu.user_id " +
                $"left join files if on if.id = c.image_file_id " +
                $"where c.id = @id;";

            Dictionary<Guid, Chat> chats = new ();
            Dictionary<Guid, Message> messages = new();

            await using var connection = new NpgsqlConnection(_connectionString);
            return (await connection.QueryAsync<Chat, Message, User, File, File, User, File, Chat>(sql,
                (chat, message, sender, userImageFile, file, user, chatImageFile) =>
                {
                    if (!chats.TryGetValue(chat.Id, out var chatEntry))
                    {
                        chatEntry = chat;
                        chatEntry.ImageFile = chatImageFile;
                        chatEntry.Messages = new List<Message>();
                        chatEntry.Users = new List<User>();
                        chats.Add(chatEntry.Id, chatEntry);
                    }

                    if (message is not null)
                    {
                        if (!messages.TryGetValue(message.Id, out var messageEntry))
                        {
                            messageEntry = message;
                            messageEntry.Sender = sender;
                            messageEntry.Chat = new Chat()
                            {
                                Id = chatEntry.Id
                            };
                            messageEntry.Attachments = new List<File>();
                            messages.Add(messageEntry.Id, messageEntry);
                        }

                        if (userImageFile is not null)
                        {
                            messageEntry.Sender.ImageFile = userImageFile;
                        }
                        
                        if (file is not null)
                        {
                            if (!messageEntry.Attachments.AsList().Exists(file1 => file1.Id == file.Id))
                            {
                                messageEntry.Attachments.AsList().Add(file);
                            }
                        }
                        
                        var index = chatEntry.Messages.AsList().FindIndex(message1 => message1.Id == messageEntry.Id);
                        
                        if (index == -1)
                        {
                            chatEntry.Messages.AsList().Add(messageEntry);
                        }
                        else
                        {
                            chatEntry.Messages.AsList()[index] = messageEntry;
                        }
                    }

                    if (user is not null)
                    {
                        var existingUserIndex = chatEntry.Users.AsList().FindIndex(user1 => user1.Id == user.Id);

                        if (existingUserIndex == -1)
                        {
                            user.ImageFile = userImageFile;
                            chatEntry.Users.AsList().Add(user);
                        }
                    }

                    return chatEntry;
                }, new { id })).Distinct().FirstOrDefault();
        }

        public async Task<IEnumerable<Chat>> ReadList(string pattern)
        {
            var sql =
                $"select * from chats c " + 
                $"inner join chats_users cu on c.id = cu.chat_id " + 
                $"left join messages m on m.chat_id = c.id " +
                $"left join users u1 on m.sender_id = u1.id " +
                $"left join files uf on uf.id = u1.image_file_id " +
                $"left join messages_files ma on ma.message_id = m.id " +
                $"left join files a on a.id = ma.file_id " +
                $"inner join users u2 on u2.id = cu.user_id " +
                $"left join files if on if.id = c.image_file_id " +
                $"where c.name like @pattern;";


            Dictionary<Guid, Chat> chats = new ();
            Dictionary<Guid, Message> messages = new();

            await using var connection = new NpgsqlConnection(_connectionString);
            return (await connection.QueryAsync<Chat, Message, User, File, File, User, File, Chat>(sql,
                (chat, message, sender, userImageFile, file, user, chatImageFile) =>
                {
                    if (!chats.TryGetValue(chat.Id, out var chatEntry))
                    {
                        chatEntry = chat;
                        chatEntry.ImageFile = chatImageFile;
                        chatEntry.Messages = new List<Message>();
                        chatEntry.Users = new List<User>();
                        chats.Add(chatEntry.Id, chatEntry);
                    }

                    if (message is not null)
                    {
                        if (!messages.TryGetValue(message.Id, out var messageEntry))
                        {
                            messageEntry = message;
                            messageEntry.Sender = sender;
                            messageEntry.Chat = new Chat()
                            {
                                Id = chatEntry.Id
                            };
                            messageEntry.Attachments = new List<File>();
                            messages.Add(messageEntry.Id, messageEntry);
                        }

                        if (userImageFile is not null)
                        {
                            messageEntry.Sender.ImageFile = userImageFile;
                        }
                        
                        if (file is not null)
                        {
                            if (!messageEntry.Attachments.AsList().Exists(file1 => file1.Id == file.Id))
                            {
                                messageEntry.Attachments.AsList().Add(file);
                            }
                        }
                        
                        var index = chatEntry.Messages.AsList().FindIndex(message1 => message1.Id == messageEntry.Id);
                        
                        if (index == -1)
                        {
                            chatEntry.Messages.AsList().Add(messageEntry);
                        }
                        else
                        {
                            chatEntry.Messages.AsList()[index] = messageEntry;
                        }
                    }

                    if (user is not null)
                    {
                        var existingUserIndex = chatEntry.Users.AsList().FindIndex(user1 => user1.Id == user.Id);

                        if (existingUserIndex == -1)
                        {
                            user.ImageFile = userImageFile;
                            chatEntry.Users.AsList().Add(user);
                        }
                    }

                    return chatEntry;
                }, new { pattern = $"%{pattern}%"})).Distinct();
        }
        
        public async Task<IEnumerable<Chat>> ReadList(Guid userId)
        {
            var sql =
                $"select * from chats c " + 
                $"inner join chats_users cu on c.id = cu.chat_id " + 
                $"left join messages m on m.chat_id = c.id " +
                $"left join users u1 on m.sender_id = u1.id " +
                $"left join files uf on uf.id = u1.image_file_id " +
                $"left join messages_files ma on ma.message_id = m.id " +
                $"left join files a on a.id = ma.file_id " +
                $"inner join users u2 on u2.id = cu.user_id " +
                $"left join files if on if.id = c.image_file_id " +
                $"where cu.user_id = @userId;";

            Dictionary<Guid, Chat> chats = new ();
            Dictionary<Guid, Message> messages = new();

            await using var connection = new NpgsqlConnection(_connectionString);
            return (await connection.QueryAsync<Chat, Message, User, File, File, User, File, Chat>(sql,
                (chat, message, sender, userImageFile, file, user, chatImageFile) =>
                {
                    if (!chats.TryGetValue(chat.Id, out var chatEntry))
                    {
                        chatEntry = chat;
                        chatEntry.ImageFile = chatImageFile;
                        chatEntry.Messages = new List<Message>();
                        chatEntry.Users = new List<User>();
                        chats.Add(chatEntry.Id, chatEntry);
                    }

                    if (message is not null)
                    {
                        if (!messages.TryGetValue(message.Id, out var messageEntry))
                        {
                            messageEntry = message;
                            messageEntry.Sender = sender;
                            messageEntry.Chat = new Chat()
                            {
                                Id = chatEntry.Id
                            };
                            messageEntry.Attachments = new List<File>();
                            messages.Add(messageEntry.Id, messageEntry);
                        }

                        if (userImageFile is not null)
                        {
                            messageEntry.Sender.ImageFile = userImageFile;
                        }
                        
                        if (file is not null)
                        {
                            if (!messageEntry.Attachments.AsList().Exists(file1 => file1.Id == file.Id))
                            {
                                messageEntry.Attachments.AsList().Add(file);
                            }
                        }
                        
                        var index = chatEntry.Messages.AsList().FindIndex(message1 => message1.Id == messageEntry.Id);
                        
                        if (index == -1)
                        {
                            chatEntry.Messages.AsList().Add(messageEntry);
                        }
                        else
                        {
                            chatEntry.Messages.AsList()[index] = messageEntry;
                        }
                    }

                    if (user is not null)
                    {
                        var existingUserIndex = chatEntry.Users.AsList().FindIndex(user1 => user1.Id == user.Id);

                        if (existingUserIndex == -1)
                        {
                            user.ImageFile = userImageFile;
                            chatEntry.Users.AsList().Add(user);
                        }
                    }

                    return chatEntry;
                }, new { userId })).Distinct();
        }

        public async Task<Chat> Update(Guid id, ChatToAddDto chatToAddDto)
        {
            var sql = 
                $"update chats set (name) = (@Name) " +
                $"where id = @id " +
                $"returning *;";

            await using var connection = new NpgsqlConnection(_connectionString);
            return await connection.QueryFirstAsync<Chat>(sql, 
                new {chatToAddDto.Name, id});
        }

        public async Task Delete(Guid id)
        {
            var sql = "delete from chats where id = @id;";

            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.ExecuteAsync(sql, new { id });
        }

        public async Task RemoveUser(Guid chatId, Guid userId)
        {
            var sql = 
                $"update chats_users set (is_left) = (false) " +
                $"where (chat_id, user_id) = (@chatId, @userId);";

            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.ExecuteAsync(sql, new { chatId, userId });
        }
    }
}