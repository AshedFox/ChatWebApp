using AutoMapper;
using Backend.Api.DTOs;
using Backend.Api.Models;

namespace Backend.Api.Helpers
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