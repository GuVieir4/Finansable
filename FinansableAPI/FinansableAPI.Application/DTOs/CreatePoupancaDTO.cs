namespace FinansableAPI.Application.DTOs
{
    public class CreatePoupancaDTO
    {
        public string Nome { get; set; }
        public decimal ValorAlvo { get; set; }
        public decimal ValorAtual { get; set; }
        public DateTime DataInicio { get; set; }
        public DateTime? DataFim { get; set; }
        public int UsuarioId { get; set; }
    }
}