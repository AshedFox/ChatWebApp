using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
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
    public class MessagesController : ControllerBase
    {
        private readonly IMessagesRepository _messagesRepository;
        private readonly IChatsRepository _chatsRepository;
        private readonly IUsersRepository _usersRepository;
        private readonly IMapper _mapper;

        public MessagesController(IMapper mapper,
            IMessagesRepository messagesRepository,
            IChatsRepository chatsRepository,
            IUsersRepository usersRepository)
        {
            _mapper = mapper;
            _messagesRepository = messagesRepository;
            _chatsRepository = chatsRepository;
            _usersRepository = usersRepository;
        }
        
        // GET: messages
        [HttpGet]
        public async Task<IActionResult> GetList([Required] Guid chatId, Guid? lastMessageId, ulong? limit)
        {
            try
            {
                if (await _chatsRepository.Read(chatId) is null)
                {
                    return NotFound();
                }

                if (lastMessageId is null)
                {

                    if (limit is null)
                    {
                        return Ok(_mapper.Map<IEnumerable<Message>, IEnumerable<MessageDto>>(
                            await _messagesRepository.ReadList(chatId)));
                    }
                    else
                    {
                        return Ok(_mapper.Map<IEnumerable<Message>, IEnumerable<MessageDto>>(
                            await _messagesRepository.ReadList(chatId, limit.Value)));
                    }
                }
                else
                {
                    if (limit is null)
                    {
                        return Ok(_mapper.Map<IEnumerable<Message>, IEnumerable<MessageDto>>(
                            await _messagesRepository.ReadListSince(chatId, lastMessageId.Value)));
                    }
                    else
                    {
                        return Ok(_mapper.Map<IEnumerable<Message>, IEnumerable<MessageDto>>(
                            await _messagesRepository.ReadListSince(chatId, lastMessageId.Value, limit.Value)));
                    }
                }
            }
            catch (Exception e)
            {
                return Problem(e.Message);
            }
        }

        // GET: messages/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get([Required] Guid id)
        {
            try
            {
                return Ok(_mapper.Map<Message, MessageDto>(await _messagesRepository.Read(id)));
            }
            catch (Exception e)
            {
                return Problem(e.Message);
            }
        }

        // POST: messages
        [HttpPost]
        public async Task<IActionResult> Post([Required] [FromBody] MessageToAddDto messageToAdd)
        {
            try
            {
                return Ok(_mapper.Map<Message, MessageDto>(await _messagesRepository.Create(messageToAdd)));
            }
            catch (Exception e)
            {
                return Problem(e.Message);
            }
        }

        // PUT: messages/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put([Required] Guid id, [Required] [FromBody] MessageToAddDto messageToAdd)
        {
            try
            {
                return Ok(_mapper.Map<Message, MessageDto>(await _messagesRepository.Update(id, messageToAdd)));
            }
            catch (Exception e)
            {
                return Problem(e.Message);
            }
        }

        // DELETE: messages/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete([Required] Guid id)
        {
            try
            {
                if (await _messagesRepository.Read(id) is null)
                {
                    return NotFound();
                }
                
                await _messagesRepository.Delete(id);
                return Ok();
            }
            catch (Exception e)
            {
                return Problem(e.Message);
            }
        }
    }
}
