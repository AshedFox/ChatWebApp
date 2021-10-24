using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Backend.Api.Models
{
    public class User
    {
        public Guid Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string Salt { get; set; }
        public string Name { get; set; }
        public DateTime CreatedAt { get; set; }
        public File ImageFile { get; set; }
        public IEnumerable<Chat> Chats { get; set; }
    }
}