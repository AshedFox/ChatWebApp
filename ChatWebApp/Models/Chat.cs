using System;
using System.Collections.Generic;

namespace ChatWebApp.Models
{
    public class Chat
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public File ImageFile { get; set; }
        public IEnumerable<Message> Messages { get; set; }
        public IEnumerable<User> Users { get; set; }
    }
}