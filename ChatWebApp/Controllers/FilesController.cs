using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using AutoMapper;
using ChatWebApp.Data;
using ChatWebApp.DTOs;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ChatWebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class FilesController : ControllerBase
    {
        private readonly IFilesRepository _filesRepository;
        private readonly IChatsRepository _chatsRepository;
        private readonly IMessagesRepository _messagesRepository;
        private readonly IMapper _mapper;
        private readonly Cloudinary _cloudinary;
        
        public FilesController(
            IFilesRepository filesRepository,
            IChatsRepository chatsRepository,
            IMessagesRepository messagesRepository,
            IMapper mapper
        )
        {
            _filesRepository = filesRepository;
            _chatsRepository = chatsRepository;
            _messagesRepository = messagesRepository;
            _mapper = mapper;
            
            var account = new Account(
                "drtwnz3ni",
                "428946811592385",
                "8BTx7IzzPl99cDu3IDKnj06CIhw");

            _cloudinary = new Cloudinary(account);
        }

        // GET: files
        [HttpGet]
        public async Task<IActionResult> GetList(Guid chatId, Guid? messageId)
        {
            try
            {
                if (await _chatsRepository.Read(chatId) is null)
                {
                    return NotFound();
                }
                
                if (messageId is null)
                {
                    return Ok(await _filesRepository.ReadList(chatId));
                }

                if (await _messagesRepository.Read(messageId.Value) is null)
                {
                    return NotFound();
                }

                return Ok(_mapper.Map<IEnumerable<Models.File>, IEnumerable<FileDto>>(
                    await _filesRepository.ReadList(chatId, messageId.Value)));
            }
            catch (Exception e)
            {
                return Problem(e.Message);
            }
        }

        // GET: files/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            try
            {
                return Ok(_mapper.Map<Models.File, FileDto>(await _filesRepository.Read(id)));
            }
            catch (Exception e)
            {
                return Problem(e.Message);
            }
        }

        // POST: files
        [HttpPost]
        public async Task<IActionResult> Post(IFormFile file)
        {
            try
            {
                if (file is null || file.Length <= 0)
                {
                    return BadRequest();
                }

                var path = $"files/{Guid.NewGuid().ToString()}";
                var filename = Path.GetFileName(file.FileName);
                
                await using (var stream = file.OpenReadStream())
                {
                    if (file.ContentType.StartsWith("image"))
                    {
                        var uploadParams = new ImageUploadParams()
                        {
                            File = new FileDescription(filename, stream),
                            PublicId = path,
                            Overwrite = true,
                        };

                        await _cloudinary.UploadAsync(uploadParams);
                    }
                    else if (file.ContentType.StartsWith("video"))
                    {
                        var uploadParams = new VideoUploadParams()
                        {
                            File = new FileDescription(filename, stream),
                            PublicId = path,
                            Overwrite = true,
                        };
                        
                        await _cloudinary.UploadAsync(uploadParams);
                    }
                }
                
                FileToAddDto fileToAdd = new(filename, path, file.ContentType);
                return Ok(_mapper.Map<Models.File, FileDto>(await _filesRepository.Create(fileToAdd)));
            }
            catch (Exception e)
            {
                return Problem(e.Message);
            }
        }

        // DELETE: files/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                if (await _filesRepository.Read(id) is null)
                {
                    return NotFound();
                }
                
                var file = await _filesRepository.Delete(id);

                var deletionParams = new DeletionParams(file.Path);
                await _cloudinary.DestroyAsync(deletionParams);

                return Ok();
            }
            catch (Exception e)
            {
                return Problem(e.Message);
            }
        }
    }
}