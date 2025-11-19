using FinansableAPI.Core.Entities;

namespace FinansableAPI.Core.Ports
{
    public interface IUsuarioRepository
    {
        Task<Usuario> GetByIdAsync(int id);
        Task<IEnumerable<Usuario>> GetAllAsync();
        Task<Usuario?> GetByEmailAsync(string email);
        Task<Usuario?> GetByCpfAsync(string cpf);
        Task AddAsync(Usuario usuario);
        Task UpdateAsync(Usuario usuario);
        Task DeleteAsync(int id);
    }
}