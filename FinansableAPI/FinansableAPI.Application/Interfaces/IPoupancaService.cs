using FinansableAPI.Application.DTOs;

namespace FinansableAPI.Application.Interfaces
{
    public interface IPoupancaService
    {
        Task<PoupancaDTO> GetByIdAsync(int id);
        Task<IEnumerable<PoupancaDTO>> GetAllAsync();
        Task<IEnumerable<PoupancaDTO>> GetByUsuarioIdAsync(int usuarioId);
        Task AddAsync(CreatePoupancaDTO poupancaDto);
        Task UpdateAsync(UpdatePoupancaDTO poupancaDto);
        Task DeleteAsync(int id);
    }
}