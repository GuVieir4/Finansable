namespace FinansableAPI.Application.DTOs
{
    public class CreateUsuarioDTO
    {
        public string Nome { get; set; }
        public string CPF { get; set; }
        public string Email { get; set; }
        public string Senha { get; set; }
        public int TipoUsuario { get; set; }
    }
}