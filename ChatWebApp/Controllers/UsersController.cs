using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Backend.Api.Data;
using Backend.Api.DTOs;
using Backend.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace Backend.Api.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IUsersRepository _usersRepository;

        public UsersController(IMapper mapper, IUsersRepository usersRepository)
        {
            _mapper = mapper;
            _usersRepository = usersRepository;
        }

        // GET: users
        [HttpGet]
        public async Task<IActionResult> GetList()
        {
            try
            {
                return Ok(_mapper.Map<IEnumerable<User>,IEnumerable<UserDto>>(await _usersRepository.ReadList()));
            }
            catch (Exception e)
            {
                return Problem(e.Message);
            }
        }

        // GET: users/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            try
            {
                return Ok(_mapper.Map<User,UserDto>(await _usersRepository.Read(id)));
            }
            catch (Exception e)
            {
                return Problem(e.Message);
            }
        }
        
        // PUT: users/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(Guid id, [FromBody] UserToAddDto toAddDto)
        {
            try
            {
                return Ok(_mapper.Map<User,UserDto>(await _usersRepository.Update(id, toAddDto)));
            }
            catch (Exception e)
            {
                return Problem(e.Message);
            }
        }
    }
}