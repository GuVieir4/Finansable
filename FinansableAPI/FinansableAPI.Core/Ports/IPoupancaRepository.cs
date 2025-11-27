                                                                                            using FinansableAPI.Core.Entities;

namespace FinansableAPI.Core.Ports
{
    public interface IPoupancaRepository
    {
        Task<Poupanca> GetByIdAsync(int id);
        Task<IEnumerable<Poupanca>> GetAllAsync();
        Task<IEnumerable<Poupanca>> GetByUsuarioIdAsync(int usuarioId);
        Task<Poupanca> AddAsync(Poupanca poupanca);
        Task UpdateAsync(Poupanca poupanca);
        Task DeleteAsync(int id);
    }
}