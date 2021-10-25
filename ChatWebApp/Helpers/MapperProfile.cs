using AutoMapper;
using ChatWebApp.DTOs;
using ChatWebApp.Models;

namespace ChatWebApp.Helpers
{
    public class MapperProfile:Profile
    {
        public MapperProfile()
        {
            CreateMap<User, UserDto>();
            CreateMap<Chat, ChatDto>();
            CreateMap<Message, MessageDto>();
            CreateMap<File, FileDto>();
        }
    }
}