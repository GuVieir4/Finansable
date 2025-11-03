namespace FinansableAPI.Core.Entities
{
    public class Poupanca
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public decimal ValorAlvo { get; set; }
        public decimal ValorAtual { get; set; }
        public DateTime DataInicio { get; set; }
        public DateTime DataFim { get; set; }
        public int UsuarioId { get; set; }
    }
}