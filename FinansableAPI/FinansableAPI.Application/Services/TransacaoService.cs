using FinansableAPI.Application.DTOs;
using FinansableAPI.Application.Interfaces;
using FinansableAPI.Core.Entities;
using FinansableAPI.Core.Exceptions;
using FinansableAPI.Core.Ports;

namespace FinansableAPI.Application.Services
{
    public class TransacaoService : ITransacaoService
    {
        private readonly ITransacaoRepository _transacaoRepository;
        private readonly IPoupancaRepository _poupancaRepository;

        public TransacaoService(ITransacaoRepository transacaoRepository, IPoupancaRepository poupancaRepository)
        {
            _transacaoRepository = transacaoRepository;
            _poupancaRepository = poupancaRepository;
        }

        public async Task<TransacaoDTO> GetByIdAsync(int id)
        {
            var transacao = await _transacaoRepository.GetByIdAsync(id);
            if (transacao == null)
            {
                throw new EntityNotFoundException("Transação", id);
            }

            return new TransacaoDTO
            {
                Id = transacao.Id,
                Nome = transacao.Nome,
                Valor = transacao.Valor,
                TipoCategoria = transacao.TipoCategoria,
                TipoMeioPagamento = transacao.TipoMeioPagamento,
                TipoMovimentacao = transacao.TipoMovimentacao,
                Data = transacao.Data,
                UsuarioId = transacao.UsuarioId,
                PoupancaId = transacao.PoupancaId
            };
        }

        public async Task<IEnumerable<TransacaoDTO>> GetAllAsync()
        {
            var transacoes = await _transacaoRepository.GetAllAsync();
            return transacoes.Select(t => new TransacaoDTO
            {
                Id = t.Id,
                Nome = t.Nome,
                Valor = t.Valor,
                TipoCategoria = t.TipoCategoria,
                TipoMeioPagamento = t.TipoMeioPagamento,
                TipoMovimentacao = t.TipoMovimentacao,
                Data = t.Data,
                UsuarioId = t.UsuarioId,
                PoupancaId = t.PoupancaId
            });
        }

        public async Task<IEnumerable<TransacaoDTO>> GetByUsuarioIdAsync(int usuarioId)
        {
            var transacoes = await _transacaoRepository.GetByUsuarioIdAsync(usuarioId);
            return transacoes.Select(t => new TransacaoDTO
            {
                Id = t.Id,
                Nome = t.Nome,
                Valor = t.Valor,
                TipoCategoria = t.TipoCategoria,
                TipoMeioPagamento = t.TipoMeioPagamento,
                TipoMovimentacao = t.TipoMovimentacao,
                Data = t.Data,
                UsuarioId = t.UsuarioId,
                PoupancaId = t.PoupancaId
            });
        }

        public async Task AddAsync(CreateTransacaoDTO transacaoDto)
        {
            // If PoupancaId is provided, validate and update the poupanca
            if (transacaoDto.PoupancaId.HasValue)
            {
                var poupanca = await _poupancaRepository.GetByIdAsync(transacaoDto.PoupancaId.Value);
                if (poupanca == null)
                {
                    throw new EntityNotFoundException("Poupança", transacaoDto.PoupancaId.Value);
                }

                // Check if poupanca is already completed
                if (poupanca.ValorAtual >= poupanca.ValorAlvo)
                {
                    throw new InvalidOperationException("Não é possível adicionar valores a uma poupança já concluída.");
                }

                // Update poupanca value
                poupanca.ValorAtual += transacaoDto.Valor;
                await _poupancaRepository.UpdateAsync(poupanca);
            }

            var transacao = new Transacao
            {
                Nome = transacaoDto.Nome,
                Valor = transacaoDto.Valor,
                TipoCategoria = transacaoDto.TipoCategoria,
                TipoMeioPagamento = transacaoDto.TipoMeioPagamento,
                TipoMovimentacao = transacaoDto.TipoMovimentacao,
                Data = transacaoDto.Data,
                UsuarioId = transacaoDto.UsuarioId,
                PoupancaId = transacaoDto.PoupancaId
            };
            await _transacaoRepository.AddAsync(transacao);
        }

        public async Task UpdateAsync(UpdateTransacaoDTO transacaoDto)
        {
            var transacao = new Transacao
            {
                Id = transacaoDto.Id,
                Nome = transacaoDto.Nome,
                Valor = transacaoDto.Valor,
                TipoCategoria = transacaoDto.TipoCategoria,
                TipoMeioPagamento = transacaoDto.TipoMeioPagamento,
                TipoMovimentacao = transacaoDto.TipoMovimentacao,
                Data = transacaoDto.Data,
                UsuarioId = transacaoDto.UsuarioId,
                PoupancaId = transacaoDto.PoupancaId
            };
            await _transacaoRepository.UpdateAsync(transacao);
        }

        public async Task DeleteAsync(int id)
        {
            await _transacaoRepository.DeleteAsync(id);
        }
    }
}