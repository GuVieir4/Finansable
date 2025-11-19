using System.ComponentModel.DataAnnotations;
using FinansableAPI.Core.Validations;

namespace FinansableAPI.Application.DTOs
{
    public class CreateUsuarioDTO
    {
        [Required(ErrorMessage = "Nome é obrigatório")]
        [StringLength(100, ErrorMessage = "Nome deve ter no máximo 100 caracteres")]
        public string Nome { get; set; }

        [Required(ErrorMessage = "CPF é obrigatório")]
        public string CPF { get; set; }

        [Required(ErrorMessage = "Email é obrigatório")]
        [EmailAddress(ErrorMessage = "Email inválido")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Senha é obrigatória")]
        [MinLength(8, ErrorMessage = "Senha deve ter pelo menos 8 caracteres")]
        public string Senha { get; set; }

        [Required(ErrorMessage = "Tipo de usuário é obrigatório")]
        [Range(1, 3, ErrorMessage = "Tipo de usuário deve ser 1, 2 ou 3")]
        public int TipoUsuario { get; set; }

        public bool IsCpfValid()
        {
            return CpfValidation.IsValid(CPF);
        }

        public bool HasSpecialCharacter()
        {
            return Senha.Any(c => "!@#$%^&*()_+-=[]{}|;:,.<>?".Contains(c));
        }
    }
}