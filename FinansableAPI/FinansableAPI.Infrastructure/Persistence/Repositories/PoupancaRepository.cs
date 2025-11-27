using FinansableAPI.Core.Entities;
using FinansableAPI.Core.Ports;
using Microsoft.EntityFrameworkCore;

namespace FinansableAPI.Infrastructure.Persistence.Repositories
{
    public class PoupancaRepository : IPoupancaRepository
    {
        private readonly FinansableDbContext _context;

        public PoupancaRepository(FinansableDbContext context)
        {
            _context = context;
        }

        public async Task<Poupanca> GetByIdAsync(int id)
        {
            return await _context.Poupancas.FindAsync(id);
        }

        public async Task<IEnumerable<Poupanca>> GetAllAsync()
        {
            return await _context.Poupancas.ToListAsync();
        }

        public async Task<IEnumerable<Poupanca>> GetByUsuarioIdAsync(int usuarioId)
        {
            return await _context.Poupancas.Where(p => p.UsuarioId == usuarioId).ToListAsync();
        }

        public async Task<Poupanca> AddAsync(Poupanca poupanca)
        {
            await _context.Poupancas.AddAsync(poupanca);
            await _context.SaveChangesAsync();
            return poupanca;
        }

        public async Task UpdateAsync(Poupanca poupanca)
        {
            _context.Poupancas.Update(poupanca);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var poupanca = await _context.Poupancas.FindAsync(id);
            if (poupanca != null)
            {
                _context.Poupancas.Remove(poupanca);
                await _context.SaveChangesAsync();
            }
        }
    }
}