using FinansableAPI.Application.DTOs;
using FinansableAPI.Application.Interfaces;
using FinansableAPI.Core.Entities;
using FinansableAPI.Core.Exceptions;
using FinansableAPI.Core.Ports;

namespace FinansableAPI.Application.Services
{
    public class PoupancaService : IPoupancaService
    {
        private readonly IPoupancaRepository _poupancaRepository;

        public PoupancaService(IPoupancaRepository poupancaRepository)
        {
            _poupancaRepository = poupancaRepository;
        }

        public async Task<PoupancaDTO> GetByIdAsync(int id)
        {
            var poupanca = await _poupancaRepository.GetByIdAsync(id);
            if (poupanca == null)
            {
                throw new EntityNotFoundException("Poupança", id);
            }

            return new PoupancaDTO
            {
                Id = poupanca.Id,
                Nome = poupanca.Nome,
                ValorAlvo = poupanca.ValorAlvo,
                ValorAtual = poupanca.ValorAtual,
                DataInicio = poupanca.DataInicio,
                DataFim = poupanca.DataFim,
                UsuarioId = poupanca.UsuarioId
            };
        }

        public async Task<IEnumerable<PoupancaDTO>> GetAllAsync()
        {
            var poupancas = await _poupancaRepository.GetAllAsync();
            return poupancas.Select(p => new PoupancaDTO
            {
                Id = p.Id,
                Nome = p.Nome,
                ValorAlvo = p.ValorAlvo,
                ValorAtual = p.ValorAtual,
                DataInicio = p.DataInicio,
                DataFim = p.DataFim,
                UsuarioId = p.UsuarioId
            });
        }

        public async Task<IEnumerable<PoupancaDTO>> GetByUsuarioIdAsync(int usuarioId)
        {
            var poupancas = await _poupancaRepository.GetByUsuarioIdAsync(usuarioId);
            return poupancas.Select(p => new PoupancaDTO
            {
                Id = p.Id,
                Nome = p.Nome,
                ValorAlvo = p.ValorAlvo,
                ValorAtual = p.ValorAtual,
                DataInicio = p.DataInicio,
                DataFim = p.DataFim,
                UsuarioId = p.UsuarioId
            });
        }

        public async Task AddAsync(CreatePoupancaDTO poupancaDto)
        {
            var poupanca = new Poupanca
            {
                Nome = poupancaDto.Nome,
                ValorAlvo = poupancaDto.ValorAlvo,
                ValorAtual = poupancaDto.ValorAtual,
                DataInicio = poupancaDto.DataInicio,
                DataFim = poupancaDto.DataFim,
                UsuarioId = poupancaDto.UsuarioId
            };
            await _poupancaRepository.AddAsync(poupanca);
        }

        public async Task UpdateAsync(UpdatePoupancaDTO poupancaDto)
        {
            var poupanca = new Poupanca
            {
                Id = poupancaDto.Id,
                Nome = poupancaDto.Nome,
                ValorAlvo = poupancaDto.ValorAlvo,
                ValorAtual = poupancaDto.ValorAtual,
                DataInicio = poupancaDto.DataInicio,
                DataFim = poupancaDto.DataFim,
                UsuarioId = poupancaDto.UsuarioId
            };
            await _poupancaRepository.UpdateAsync(poupanca);
        }

        public async Task DeleteAsync(int id)
        {
            await _poupancaRepository.DeleteAsync(id);
        }
    }
}