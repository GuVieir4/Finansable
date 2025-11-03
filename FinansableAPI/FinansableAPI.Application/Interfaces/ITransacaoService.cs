using FinansableAPI.Application.DTOs;

namespace FinansableAPI.Application.Interfaces
{
    public interface ITransacaoService
    {
        Task<TransacaoDTO> GetByIdAsync(int id);
        Task<IEnumerable<TransacaoDTO>> GetAllAsync();
        Task<IEnumerable<TransacaoDTO>> GetByUsuarioIdAsync(int usuarioId);
        Task AddAsync(CreateTransacaoDTO transacaoDto);
        Task UpdateAsync(UpdateTransacaoDTO transacaoDto);
        Task DeleteAsync(int id);
    }
}