using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Api.DTOs;
using Backend.Api.Models;
using Dapper;
using Npgsql;

namespace Backend.Api.Data
{
    public class FilesRepository : IFilesRepository
    {
        public FilesRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        private readonly string _connectionString;
        
        public async Task<File> Create(FileToAddDto fileToAddDto)
        {
            var sql = 
                $"insert into files(name, path, content_type) " +
                $"values (@Name, @Path, @ContentType) " +
                $"returning *;";

            await using var connection = new NpgsqlConnection(_connectionString);
            return await connection.QueryFirstAsync<File>(sql, fileToAddDto);
        }

        public async Task<File> Read(Guid id)
        {
            var sql = "select * from files where id = @id ";
            
            await using var connection = new NpgsqlConnection(_connectionString);
            return await connection.QueryFirstAsync<File>(sql, new {id});
        }
        
        public async Task<File> Read(string path)
        {
            var sql = "select * from files where path = @path ";
            
            await using var connection = new NpgsqlConnection(_connectionString);
            return await connection.QueryFirstAsync<File>(sql, new {path});
        }

        public async Task<IEnumerable<File>> ReadList(Guid chatId)
        {
            var sql = 
                $"select * from files " +
                $"inner join messages_files ma on files.id = ma.file_id " +
                $"inner join messages m on m.id = ma.message_id " +
                $"where m.chat_id = @chatId;";

            await using var connection = new NpgsqlConnection(_connectionString);
            return await connection.QueryAsync<File>(sql, new { chatId });
        }
        
        public async Task<IEnumerable<File>> ReadList(Guid chatId, Guid messageId)
        {
            var sql = 
                $"select * from files " +
                $"inner join messages_files ma on files.id = ma.file_id " +
                $"inner join messages m on m.id = ma.message_id " +
                $"where m.chat_id = @chatId and m.id = @messageId;";

            await using var connection = new NpgsqlConnection(_connectionString);
            return await connection.QueryAsync<File>(sql, new { chatId, messageId });
        }

        public async Task<File> Update(Guid id, FileToAddDto fileToAddDto)
        {
            var sql = 
                $"update files set (name, path) = (@Name, @Path) " +
                $"where id = @id " +
                $"returning *;";

            await using var connection = new NpgsqlConnection(_connectionString);
            return await connection.QueryFirstOrDefaultAsync<File>(sql, 
                new {fileToAddDto.Name, fileToAddDto.Path, id});
        }

        public async Task<File> Delete(Guid id)
        {
            var sql = "delete from files where id = @id returning *;";

            await using var connection = new NpgsqlConnection(_connectionString);
            return await connection.QueryFirstAsync<File>(sql, new {id});
        }
    }
}