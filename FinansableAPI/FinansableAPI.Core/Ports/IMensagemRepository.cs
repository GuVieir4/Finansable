using FinansableAPI.Core.Entities;

namespace FinansableAPI.Core.Ports
{
    public interface IMensagemRepository
    {
        Task<Mensagem> AddAsync(Mensagem mensagem);
        Task<List<Mensagem>> GetByUsuarioIdAsync(int usuarioId);
    }
}