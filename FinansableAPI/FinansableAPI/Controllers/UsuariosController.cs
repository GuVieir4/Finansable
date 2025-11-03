using FinansableAPI.Application.DTOs;
using FinansableAPI.Application.Interfaces;
using FinansableAPI.Core.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace FinansableAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuariosController : ControllerBase
    {
        private readonly IUsuarioService _usuarioService;

        public UsuariosController(IUsuarioService usuarioService)
        {
            _usuarioService = usuarioService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO loginDto)
        {
            var usuario = await _usuarioService.AuthenticateAsync(loginDto.Email, loginDto.Senha);
            if (usuario == null)
            {
                return Unauthorized("Email ou senha incorretos.");
            }
            return Ok(usuario);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var usuarios = await _usuarioService.GetAllAsync();
            return Ok(usuarios);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var usuario = await _usuarioService.GetByIdAsync(id);
                return Ok(usuario);
            }
            catch (EntityNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] CreateUsuarioDTO usuarioDto)
        {
            await _usuarioService.AddAsync(usuarioDto);
            return CreatedAtAction(nameof(GetById), new { id = 0 }, usuarioDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateUsuarioDTO usuarioDto)
        {
            usuarioDto.Id = id;
            await _usuarioService.UpdateAsync(usuarioDto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _usuarioService.DeleteAsync(id);
            return NoContent();
        }
    }
}