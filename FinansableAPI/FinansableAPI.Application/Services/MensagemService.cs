using FinansableAPI.Application.DTOs;
using FinansableAPI.Application.Interfaces;
using FinansableAPI.Core.Entities;
using FinansableAPI.Core.Ports;

namespace FinansableAPI.Application.Services
{
    public class MensagemService : IMensagemService
    {
        private readonly IMensagemRepository _mensagemRepository;

        public MensagemService(IMensagemRepository mensagemRepository)
        {
            _mensagemRepository = mensagemRepository;
        }

        public async Task<MensagemDTO> CriarMensagemAsync(string texto, DirecaoMensagem direcao, int? usuarioId)
        {
            var mensagem = new Mensagem
            {
                Texto = texto,
                Direcao = direcao,
                UsuarioId = usuarioId,
                DataEnvio = DateTime.Now
            };

            var savedMensagem = await _mensagemRepository.AddAsync(mensagem);

            return new MensagemDTO
            {
                Id = savedMensagem.Id,
                DataEnvio = savedMensagem.DataEnvio,
                Texto = savedMensagem.Texto,
                Direcao = savedMensagem.Direcao,
                UsuarioId = savedMensagem.UsuarioId
            };
        }

        public async Task<IEnumerable<MensagemDTO>> ListarMensagensUsuarioAsync(int usuarioId)
        {
            var mensagens = await _mensagemRepository.GetByUsuarioIdAsync(usuarioId);

            return mensagens.Select(m => new MensagemDTO
            {
                Id = m.Id,
                DataEnvio = m.DataEnvio,
                Texto = m.Texto,
                Direcao = m.Direcao,
                UsuarioId = m.UsuarioId
            });
        }
    }
}