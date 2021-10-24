using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Api.DTOs;
using Backend.Api.Models;

namespace Backend.Api.Data
{
    public interface IUsersRepository
    {
        public Task<User> Create(UserToAddDto user, string salt);
        public Task<User> Read(Guid id);
        public Task<User> Read(string login);
        public Task<IEnumerable<User>> ReadList();
        public Task<User> Update(Guid id, UserToAddDto user);
        public Task Delete(Guid id);
    }
}