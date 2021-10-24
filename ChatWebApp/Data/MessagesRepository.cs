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
    //TODO: Add possibility to add files to messages
    //TODO: Fix getting messages???
    public class MessagesRepository : IMessagesRepository
    {
        public MessagesRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        private readonly string _connectionString;
        
        public async Task<Message> Create(MessageToAddDto message)
        {
            var sql = 
                $"insert into messages (sender_id, chat_id, content) values (@SenderId, @ChatId, @Content) " + 
                $"returning *;";

            await using var connection = new NpgsqlConnection(_connectionString);
            var result = await connection.QueryFirstAsync<Message>(sql, message);

            return result;
        }

        public async Task AddFile(Guid messageId, Guid fileId)
        {
            throw new NotImplementedException();
        }

        public async Task AddFilesList(Guid messageId, IEnumerable<Guid> filesIds)
        {
            var sql = 
                $"insert into messages_files (message_id, file_id) values (@MessageId, @FileId) " + 
                $"returning *;";
            
            await using var connection = new NpgsqlConnection(_connectionString);

            foreach (var fileId in filesIds)
            {
                await connection.QueryAsync<File>(sql, new { MessageId = messageId, FileId = fileId });
            }
        }

        public async Task RemoveFile(Guid messageId, Guid fileId)
        {
            throw new NotImplementedException();
        }

        public async Task<Message> Read(Guid id)
        {
            var sql = 
                $"select * from messages m " +
                $"inner join users u on m.sender_id = u.id " +
                $"left join files uf on uf.id = u.image_file_id " +
                $"inner join chats c on m.chat_id = c.id " +
                $"left join messages_files ma on ma.message_id = m.id " +
                $"left join files a on a.id = ma.file_id " +
                $"where m.id = @id;";

            var messages = new Dictionary<Guid, Message>();

            await using var connection = new NpgsqlConnection(_connectionString);
            return 
                (await connection.QueryAsync<Message, User, File, Chat, File, Message>(
                    sql, 
                    (message, user, userImageFile, chat, file) =>
                    {
                        if (!messages.TryGetValue(message.Id, out var messageEntry))
                        {
                            messageEntry = message;
                            messageEntry.Chat = chat;
                            messageEntry.Sender = user;
                            messageEntry.Attachments = new List<File>();
                            messages.Add(messageEntry.Id, messageEntry);
                        }

                        if (userImageFile is not null)
                        {
                            messageEntry.Sender.ImageFile = userImageFile;
                        }
                        
                        if (file is not null)
                        {
                            messageEntry.Attachments.AsList().Add(file);
                        }

                        return messageEntry;
                    },
                new { id })
                ).Distinct().First();
        }

        public async Task<IEnumerable<Message>> ReadList(Guid chatId, ulong limit = 0)
        {
            var sql =
                $"select * from messages m " +
                $"inner join users u on m.sender_id = u.id " +
                $"left join files uf on uf.id = u.image_file_id " +
                $"inner join chats c on m.chat_id = c.id " +
                $"left join messages_files ma on ma.message_id = m.id " +
                $"left join files a on a.id = ma.file_id " +
                $"where c.id = @chatId " +
                $"order by sent_at";

            if (limit > 0)
            {
                sql += $" limit {limit}";
            }
            
            var commandDefinition = new CommandDefinition(sql, new { chatId });

            return await ReadListInternal(commandDefinition);
        }

        public async Task<IEnumerable<Message>> ReadListSince(Guid chatId, Guid lastMessageId, ulong limit = 0)
        {
            var sql =
                $"select * from messages m " +
                $"inner join users u on m.sender_id = u.id " +
                $"left join files uf on uf.id = u.image_file_id " +
                $"inner join chats c on m.chat_id = c.id " +
                $"left join messages_files ma on ma.message_id = m.id " +
                $"left join files a on a.id = ma.file_id " +
                $"WHERE sent_at > " +
                $"(SELECT sent_at FROM messages WHERE messages.id = @lastMessageId LIMIT 1) and c.id = @chatId " +
                $"ORDER BY sent_at";

            if (limit > 0)
            {
                sql += $" limit {limit}";
            }

            var commandDefinition = new CommandDefinition(sql, new { chatId, lastMessageId });

            return await ReadListInternal(commandDefinition);
        }

        public async Task<Message> Update(Guid id, MessageToAddDto message)
        {
            var sql = 
                $"update messages set content = @Content " +
                $"where id = @id " +
                $"returning *;";

            await using var connection = new NpgsqlConnection(_connectionString);
            return await connection.QueryFirstAsync<Message>(sql, new {message.Content, id});
        }

        public async Task Delete(Guid id)
        {
            var sql = "delete from messages where id = @id;";

            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.ExecuteAsync(sql, new {id});
        }

        private async Task<IEnumerable<Message>> ReadListInternal(CommandDefinition sql)
        {
            var messages = new Dictionary<Guid, Message>();
            
            await using var connection = new NpgsqlConnection(_connectionString);
            var result = 
                (await connection.QueryAsync<Message, User, File, Chat, File, Message>(
                    sql, 
                    (message, user, userImageFile, chat, file) =>
                    {
                        if (!messages.TryGetValue(message.Id, out var messageEntry))
                        {
                            messageEntry = message;
                            messageEntry.Chat = chat;
                            messageEntry.Sender = user;
                            messageEntry.Attachments = new List<File>();
                            messages.Add(messageEntry.Id, messageEntry);
                        }

                        if (userImageFile is not null)
                        {
                            messageEntry.Sender.ImageFile = userImageFile;
                        }
                        
                        if (file is not null)
                        {
                            messageEntry.Attachments.AsList().Add(file);
                        }

                        return messageEntry;
                    })
                ).Distinct();

            return result;
        }
    }
}