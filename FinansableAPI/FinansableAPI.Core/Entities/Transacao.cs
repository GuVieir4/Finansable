namespace FinansableAPI.Core.Entities
{
    public class Transacao
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public decimal Valor { get; set; }
        public int TipoCategoria { get; set; }
        public int TipoMeioPagamento { get; set; }
        public int TipoMovimentacao { get; set; }
        public DateTime Data { get; set; }
        public int UsuarioId { get; set; }
        public int? PoupancaId { get; set; }
    }
}