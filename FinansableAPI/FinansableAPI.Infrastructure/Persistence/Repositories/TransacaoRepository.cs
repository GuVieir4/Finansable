using FinansableAPI.Core.Entities;
using FinansableAPI.Core.Ports;
using Microsoft.EntityFrameworkCore;

namespace FinansableAPI.Infrastructure.Persistence.Repositories
{
    public class TransacaoRepository : ITransacaoRepository
    {
        private readonly FinansableDbContext _context;

        public TransacaoRepository(FinansableDbContext context)
        {
            _context = context;
        }

        public async Task<Transacao> GetByIdAsync(int id)
        {
            return await _context.Transacoes.FindAsync(id);
        }

        public async Task<IEnumerable<Transacao>> GetAllAsync()
        {
            return await _context.Transacoes.ToListAsync();
        }

        public async Task<IEnumerable<Transacao>> GetByUsuarioIdAsync(int usuarioId)
        {
            return await _context.Transacoes.Where(t => t.UsuarioId == usuarioId).ToListAsync();
        }

        public async Task AddAsync(Transacao transacao)
        {
            await _context.Transacoes.AddAsync(transacao);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Transacao transacao)
        {
            _context.Transacoes.Update(transacao);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var transacao = await _context.Transacoes.FindAsync(id);
            if (transacao != null)
            {
                _context.Transacoes.Remove(transacao);
                await _context.SaveChangesAsync();
            }
        }
    }
}