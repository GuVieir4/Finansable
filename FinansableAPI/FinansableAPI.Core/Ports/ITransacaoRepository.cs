                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                using FinansableAPI.Core.Entities;

namespace FinansableAPI.Core.Ports
{
    public interface ITransacaoRepository
    {
        Task<Transacao> GetByIdAsync(int id);
        Task<IEnumerable<Transacao>> GetAllAsync();
                                                                                                                                                                                                                                            Task<IEnumerable<Transacao>> GetByUsuarioIdAsync(int usuarioId);
        Task AddAsync(Transacao transacao);
        Task UpdateAsync(Transacao transacao);
        Task DeleteAsync(int id);
    }
}           