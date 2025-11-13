using FinansableAPI.Core.Entities;

namespace FinansableAPI.Application.DTOs
{
    public class MensagemDTO
    {
        public int Id { get; set; }
        public DateTime DataEnvio { get; set; }
        public string Texto { get; set; }
        public DirecaoMensagem Direcao { get; set; }
        public int? UsuarioId { get; set; }
    }
}