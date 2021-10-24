using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Api.Models
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