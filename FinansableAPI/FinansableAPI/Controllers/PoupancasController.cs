using FinansableAPI.Application.DTOs;
using FinansableAPI.Application.Interfaces;
using FinansableAPI.Core.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace FinansableAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PoupancasController : ControllerBase
    {
        private readonly IPoupancaService _poupancaService;

        public PoupancasController(IPoupancaService poupancaService)
        {
            _poupancaService = poupancaService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var poupancas = await _poupancaService.GetAllAsync();
            return Ok(poupancas);
        }

        [HttpGet("usuario/{usuarioId}")]
        public async Task<IActionResult> GetByUsuarioId(int usuarioId)
        {
            var poupancas = await _poupancaService.GetByUsuarioIdAsync(usuarioId);
            return Ok(poupancas);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var poupanca = await _poupancaService.GetByIdAsync(id);
                return Ok(poupanca);
            }
            catch (EntityNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreatePoupancaDTO poupancaDto)
        {
            await _poupancaService.AddAsync(poupancaDto);
            return CreatedAtAction(nameof(GetById), new { id = 0 }, poupancaDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdatePoupancaDTO poupancaDto)
        {
            poupancaDto.Id = id;
            await _poupancaService.UpdateAsync(poupancaDto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _poupancaService.DeleteAsync(id);
            return NoContent();
        }
    }
}