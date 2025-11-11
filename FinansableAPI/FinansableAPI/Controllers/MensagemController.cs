using FinansableAPI.Application.DTOs;
using FinansableAPI.Application.Interfaces;
using FinansableAPI.Application.Services;
using FinansableAPI.Core.Exceptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FinansableAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MensagemController : ControllerBase
    {
        private readonly MensagemService _service;

        public MensagemController(MensagemService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> CriarMensagem([FromBody] MensagemInput input)
        {
            if (string.IsNullOrWhiteSpace(input.Texto))
                return BadRequest("O texto da mensagem não pode ser vazio.");

            var mensagem = await _service.CriarMensagemAsync(input.Texto, input.Direcao, input.UsuarioId);
            return Ok(mensagem);
        }

        [HttpGet("{usuarioId}")]
        public async Task<IActionResult> ListarMensagens(int usuarioId)
        {
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
