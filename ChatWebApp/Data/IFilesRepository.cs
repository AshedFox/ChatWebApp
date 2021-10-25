using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ChatWebApp.DTOs;
using ChatWebApp.Models;

namespace ChatWebApp.Data
{
    public interface IFilesRepository
    {
        public Task<File> Create(FileToAddDto file);
        public Task<File> Read(Guid id);
        public Task<File> Read(string path);
        public Task<IEnumerable<File>> ReadList(Guid chatId);
        public Task<IEnumerable<File>> ReadList(Guid chatId, Guid messageId);
        public Task<File> Update(Guid id, FileToAddDto file);
        public Task<File> Delete(Guid id);
    }
}