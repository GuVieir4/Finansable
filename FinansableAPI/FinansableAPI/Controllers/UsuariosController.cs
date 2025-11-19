using FinansableAPI.Application.DTOs;
using FinansableAPI.Application.Interfaces;
using FinansableAPI.Core.Exceptions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace FinansableAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuariosController : ControllerBase
    {
        private readonly IUsuarioService _usuarioService;
        private readonly IConfiguration _configuration;

        public UsuariosController(IUsuarioService usuarioService, IConfiguration configuration)
        {
            _usuarioService = usuarioService;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO loginDto)
        {
            var usuario = await _usuarioService.AuthenticateAsync(loginDto.Email, loginDto.Senha);
            if (usuario == null)
            {
                return Unauthorized("Email ou senha incorretos.");
            }

            var token = GenerateJwtToken(usuario);
            return Ok(new { Token = token, Usuario = usuario });
        }

        private string GenerateJwtToken(UsuarioDTO usuario)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, usuario.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, usuario.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(int.Parse(_configuration["Jwt:ExpiryInMinutes"])),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
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
            try
            {
                // Validação manual dos dados
                if (string.IsNullOrWhiteSpace(usuarioDto.Nome))
                {
                    return BadRequest(new { message = "Nome é obrigatório" });
                }

                if (string.IsNullOrWhiteSpace(usuarioDto.CPF))
                {
                    return BadRequest(new { message = "CPF é obrigatório" });
                }

                if (string.IsNullOrWhiteSpace(usuarioDto.Email))
                {
                    return BadRequest(new { message = "Email é obrigatório" });
                }

                if (string.IsNullOrWhiteSpace(usuarioDto.Senha))
                {
                    return BadRequest(new { message = "Senha é obrigatória" });
                }

                // Verifica se a senha tem pelo menos 8 caracteres
                if (usuarioDto.Senha.Length < 8)
                {
                    return BadRequest(new { message = "Senha deve ter pelo menos 8 caracteres" });
                }

                // Verifica se a senha tem pelo menos um caractere especial
                var caracteresEspeciais = "!@#$%^&*()_+-=[]{}|;:,.<>?";
                if (!usuarioDto.Senha.Any(c => caracteresEspeciais.Contains(c)))
                {
                    return BadRequest(new { message = "Senha deve conter pelo menos um caractere especial" });
                }

                // Verifica se o CPF é válido
                if (!FinansableAPI.Core.Validations.CpfValidation.IsValid(usuarioDto.CPF))
                {
                    return BadRequest(new { message = "CPF inválido" });
                }

                // Verifica se o email é válido
                var emailRegex = new System.Text.RegularExpressions.Regex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$");
                if (!emailRegex.IsMatch(usuarioDto.Email))
                {
                    return BadRequest(new { message = "Email inválido" });
                }

                await _usuarioService.AddAsync(usuarioDto);
                return CreatedAtAction(nameof(GetById), new { id = 0 }, usuarioDto);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro interno do servidor" });
            }
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