using FinansableAPI.Application.DTOs;
using FinansableAPI.Application.Interfaces;
using FinansableAPI.Core.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace FinansableAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransacoesController : ControllerBase
    {
        private readonly ITransacaoService _transacaoService;

        public TransacoesController(ITransacaoService transacaoService)
        {
            _transacaoService = transacaoService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var transacoes = await _transacaoService.GetAllAsync();
            return Ok(transacoes);
        }

        [HttpGet("usuario/{usuarioId}")]
        public async Task<IActionResult> GetByUsuarioId(int usuarioId)
        {
            var transacoes = await _transacaoService.GetByUsuarioIdAsync(usuarioId);
            return Ok(transacoes);
        }

        [HttpGet("dashboard/{usuarioId}")]
        public async Task<IActionResult> GetDashboardData(int usuarioId)
        {
            var transacoes = await _transacaoService.GetByUsuarioIdAsync(usuarioId);

            var entradas = transacoes.Where(t => t.TipoMovimentacao == 1).Sum(t => t.Valor);
            var saidas = transacoes.Where(t => t.TipoMovimentacao == 0).Sum(t => t.Valor);

            var data = new
            {
                Entradas = entradas,
                Saidas = saidas,
                Saldo = entradas - saidas,
                HasTransactions = transacoes.Any()
            };

            return Ok(data);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var transacao = await _transacaoService.GetByIdAsync(id);
                return Ok(transacao);
            }
            catch (EntityNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateTransacaoDTO transacaoDto)
        {
            await _transacaoService.AddAsync(transacaoDto);
            return CreatedAtAction(nameof(GetById), new { id = 0 }, transacaoDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateTransacaoDTO transacaoDto)
        {
            transacaoDto.Id = id;
            await _transacaoService.UpdateAsync(transacaoDto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _transacaoService.DeleteAsync(id);
            return NoContent();
        }
    }
}