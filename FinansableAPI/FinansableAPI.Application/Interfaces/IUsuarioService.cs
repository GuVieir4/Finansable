using FinansableAPI.Application.DTOs;

namespace FinansableAPI.Application.Interfaces
{
    public interface IUsuarioService
    {
        Task<UsuarioDTO> GetByIdAsync(int id);
        Task<IEnumerable<UsuarioDTO>> GetAllAsync();
        Task<UsuarioDTO?> GetByEmailAsync(string email);
        Task<UsuarioDTO?> GetByCpfAsync(string cpf);
        Task AddAsync(CreateUsuarioDTO usuarioDto);
        Task UpdateAsync(UpdateUsuarioDTO usuarioDto);
        Task DeleteAsync(int id);
        Task<UsuarioDTO?> AuthenticateAsync(string email, string senha);
    }
}