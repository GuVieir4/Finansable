using FinansableAPI.Application.DTOs;
using FinansableAPI.Application.Interfaces;
using FinansableAPI.Application.Services;
using FinansableAPI.Core.Entities;
using FinansableAPI.Core.Exceptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FinansableAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MensagemController : ControllerBase
    {
        private readonly IMensagemService _service;
        private readonly IUsuarioService _usuarioService;

        public MensagemController(IMensagemService service, IUsuarioService usuarioService)
        {
            _service = service;
            _usuarioService = usuarioService;
        }

        private async Task<bool> IsPremiumUser()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (int.TryParse(userIdClaim, out int userId))
            {
                var user = await _usuarioService.GetByIdAsync(userId);
                return user.TipoUsuario == 2; // Premium user
            }
            return false;
        }

        [HttpPost]
        public async Task<IActionResult> CriarMensagem([FromBody] MensagemInput input)
        {
            if (!await IsPremiumUser())
                return StatusCode(403, "Esta funcionalidade está disponível apenas para usuários premium.");

            if (string.IsNullOrWhiteSpace(input.Texto))
                return BadRequest("O texto da mensagem não pode ser vazio.");

            var mensagem = await _service.CriarMensagemAsync(input.Texto, (DirecaoMensagem)input.Direcao, input.UsuarioId);
            return Ok(mensagem);
        }

        [HttpGet("{usuarioId}")]
        public async Task<IActionResult> ListarMensagens(int usuarioId)
        {
            if (!await IsPremiumUser())
                return StatusCode(403, "Esta funcionalidade está disponível apenas para usuários premium.");

            var mensagens = await _service.ListarMensagensUsuarioAsync(usuarioId);
            return Ok(mensagens);
        }
    }

    public class MensagemInput
    {
        public string Texto { get; set; }
        public int Direcao { get; set; }
        public int? UsuarioId { get; set; }
    }
}
