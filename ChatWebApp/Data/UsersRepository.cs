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
    public class UsersRepository : IUsersRepository
    {
        public UsersRepository(string connectionString)
        {
            _connectionString = connectionString;
        }
        
        private readonly string _connectionString;

        public async Task<User> Create(UserToAddDto user, string salt)
        {
            var sql = 
                $"insert into users (username, email, password_hash, name, salt) " + 
                $"values (@Username, @Email, @PasswordHash, @Name, @Salt) " + 
                $"returning *;";

            await using var connection = new NpgsqlConnection(_connectionString);
            return await connection.QueryFirstAsync<User>(sql, new
            {
                user.Username, user.Email, user.PasswordHash, user.Name, Salt = salt
            });
        }

        public async Task<User> Read(Guid id)
        {
            var sql =
                $"select * from users u " +
                $"left join files if on if.id = u.image_file_id " +
                $"where u.id = @id;";
            
            await using var connection = new NpgsqlConnection(_connectionString);
            return (await connection.QueryAsync<User, File, User>(sql, (user, file) => 
            {
                user.ImageFile = file;
                return user;
            }, new { id })).Distinct().FirstOrDefault();
        }
        
        public async Task<User> Read(string login)
        {
            var sql =
                $"select * from users u " +
                $"left join files if on if.id = u.image_file_id " +
                $"where u.email = @login or " +
                $"u.username = @login";
            
            await using var connection = new NpgsqlConnection(_connectionString);
            return (await connection.QueryAsync<User, File, User>(sql, (user, file) => 
            {
                user.ImageFile = file;
                return user;
            }, new { login })).Distinct().FirstOrDefault();
        }

        public async Task<IEnumerable<User>> ReadList()
        {
            var sql = 
                $"select * from users u " +
                $"left join files if on if.id = u.image_file_id;";

            await using var connection = new NpgsqlConnection(_connectionString);
            return await connection.QueryAsync<User, File, User>(sql, (user, file) =>
            {
                user.ImageFile = file;
                return user;
            });
        }

        public async Task<User> Update(Guid id, UserToAddDto user)
        {
            var sql = 
                $"update users set " +
                $"(username, email, password_hash, name) = (@Username, @Email, @PasswordHash, @Name) " +
                $"where id = @id " +
                $"returning *;";

            await using var connection = new NpgsqlConnection(_connectionString);
            return await connection.QueryFirstOrDefaultAsync<User>(sql, 
                new {user.Email, user.PasswordHash, user.Name, id});
        }

        public async Task Delete(Guid id)
        {
            var sql = $"delete from users where id = @id;";

            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.ExecuteAsync(sql, new {id});
        }
    }
}