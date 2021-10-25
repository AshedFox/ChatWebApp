using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using ChatWebApp.Data;
using ChatWebApp.DTOs;
using ChatWebApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ChatWebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ChatsController : ControllerBase
    {
        private readonly IChatsRepository _chatsRepository;
        private readonly IUsersRepository _usersRepository;
        private readonly IMapper _mapper;

        public ChatsController(IMapper mapper, IChatsRepository chatsRepository, 
            IUsersRepository usersRepository)
        {
            _mapper = mapper;
            _chatsRepository = chatsRepository;
            _usersRepository = usersRepository;
        }
        
        // GET: chats?userId={userId}
        [HttpGet]
        public async Task<IActionResult> GetList(Guid userId)
        {
            try
            {
                return Ok(_mapper.Map<IEnumerable<Chat>, IEnumerable<ChatDto>>(
                    await _chatsRepository.ReadList(userId)));
            }
            catch (Exception e)
            {
                return Problem(e.Message);
            }
        }
        
        // GET: chats/search?pattern={pattern}
        [HttpGet("search")]
        public async Task<IActionResult> GetList(string pattern)
        {
            try
            {
                return Ok(_mapper.Map<IEnumerable<Chat>, IEnumerable<ChatDto>>(await _chatsRepository.ReadList(pattern)));
            }
            catch (Exception e)
            {
                return Problem(e.Message);
            }
        }

        // GET: chats/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            try
            {
                return Ok(_mapper.Map<Chat, ChatDto>(await _chatsRepository.Read(id)));
            }
            catch (Exception e)
            {
                return Problem(e.Message);
            }
        }

        // POST: chats
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ChatToAddDto chatToAdd)
        {
            try
            {
                return Ok(_mapper.Map<Chat, ChatDto>(await _chatsRepository.Create(chatToAdd)));
            }
            catch (Exception e)
            {
                return Problem(e.Message);
            }
        }
        
        // POST: chats/{chatId}/join?userId={userId}
        [HttpPost("{chatId}/join")]
        public async Task<IActionResult> Join(Guid chatId)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userId is null)
                {
                    return BadRequest();
                }

                if (await _chatsRepository.Read(chatId) is null)
                {
                    return NotFound();
                }

                if (await _usersRepository.Read(userId) is null)
                {
                    return NotFound();
                }
                
                await _chatsRepository.AddUser(chatId, Guid.Parse(userId));
                return Ok();
            }
            catch (Exception e)
            {
                return Problem(e.Message);
            }
        }

        // PUT: chats/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(Guid id, [FromBody] ChatToAddDto chatToAdd)
        {
            try
            {
                return Ok(await _chatsRepository.Update(id, chatToAdd));
            }
            catch (Exception e)
            {
                return Problem(e.Message);
            }
        }

        // DELETE: chats/5
        [HttpDelete("{chatId}")]
        public async Task<IActionResult> Delete(Guid chatId)
        {
            try
            {
                if (await _chatsRepository.Read(chatId) is null)
                {
                    return NotFound();
                }

                await _chatsRepository.Delete(chatId);
                return Ok();
            }
            catch (Exception e)
            {
                return Problem(e.Message);
            }
        }
        
        // DELETE: chats/{chatId}/join?userId={userId}
        [HttpDelete("{chatId}/leave")]
        public async Task<IActionResult> Leave(Guid chatId)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userId is null)
                {
                    return BadRequest();
                }
                
                if (await _chatsRepository.Read(chatId) is null)
                {
                    return NotFound();
                }

                if (await _usersRepository.Read(userId) is null)
                {
                    return NotFound();
                }

                await _chatsRepository.RemoveUser(chatId, Guid.Parse(userId));
                
                return Ok();
            }
            catch (Exception e)
            {
                return Problem(e.Message);
            }
        }
    }
}