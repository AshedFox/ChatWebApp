using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.Api.Models
{
    public class File
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Path { get; set; }
        public string ContentType { get; set; }
    }
}