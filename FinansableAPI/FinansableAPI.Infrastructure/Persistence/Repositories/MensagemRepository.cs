using FinansableAPI.Core.Entities;
using FinansableAPI.Core.Ports;
using Microsoft.EntityFrameworkCore;

namespace FinansableAPI.Infrastructure.Persistence.Repositories
{
    public class MensagemRepository
    {
        private readonly FinansableDbContext _context;

        public MensagemRepository(FinansableDbContext context)
        {
            _context = context;
        }
        public async Task<Mensagem> AdicionarAsync(Mensagem mensagem)
        {
            _context.Mensagens.Add(mensagem);
            await _context.SaveChangesAsync();
            return mensagem;
        }
        public async Task<List<Mensagem>> ListarPorUsuarioAsync(int usuarioId)
        {
            return await _context.Mensagens
                .Where(m => m.UsuarioId == usuarioId)
                .OrderBy(m => m.DataEnvio)
                .ToListAsync();
        }
    }
}
