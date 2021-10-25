using System;
using System.Collections.Generic;

namespace ChatWebApp.Models
{
    public class Message
    {
        public Guid Id { get; set; }
        public User Sender { get; set; }
        public Chat Chat { get; set; }
        public string Content { get; set; }
        public DateTime SentAt { get; set; }
        public IEnumerable<File> Attachments { get; set; }
    }
}