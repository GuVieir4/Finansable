using FinansableAPI.Application.DTOs;
using FinansableAPI.Core.Entities;

namespace FinansableAPI.Application.Interfaces
{
    public interface IMensagemService
    {
        Task<MensagemDTO> CriarMensagemAsync(string texto, DirecaoMensagem direcao, int? usuarioId);
        Task<IEnumerable<MensagemDTO>> ListarMensagensUsuarioAsync(int usuarioId);
    }
}