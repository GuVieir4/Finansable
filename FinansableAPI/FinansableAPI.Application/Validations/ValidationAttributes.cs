using System.ComponentModel.DataAnnotations;
using FinansableAPI.Core.Validations;

namespace FinansableAPI.Application.Validations
{
    public class ValidCpfAttribute : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            if (value == null || string.IsNullOrWhiteSpace(value.ToString()))
            {
                return new ValidationResult("CPF é obrigatório");
            }

            if (!CpfValidation.IsValid(value.ToString()!))
            {
                return new ValidationResult("CPF inválido");
            }

            return ValidationResult.Success!;
        }
    }

    public class PasswordContainsSpecialCharacterAttribute : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            if (value == null || string.IsNullOrWhiteSpace(value.ToString()))
            {
                return new ValidationResult("Senha é obrigatória");
            }

            string senha = value.ToString()!;
            
            if (senha.Length < 8)
            {
                return new ValidationResult("Senha deve ter pelo menos 8 caracteres");
            }

            if (!senha.Any(c => "!@#$%^&*()_+-=[]{}|;:,.<>?".Contains(c)))
            {
                return new ValidationResult("Senha deve conter pelo menos um caractere especial");
            }

            return ValidationResult.Success!;
        }
    }

    public class UniqueCpfAttribute : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            if (value == null || string.IsNullOrWhiteSpace(value.ToString()))
            {
                return ValidationResult.Success!;
            }

            var service = validationContext.GetService(typeof(FinansableAPI.Application.Interfaces.IUsuarioService)) 
                as FinansableAPI.Application.Interfaces.IUsuarioService;

            if (service == null)
            {
                return ValidationResult.Success!;
            }

            var existingUser = service.GetByCpfAsync(value.ToString()!).Result;
            
            if (existingUser != null)
            {
                return new ValidationResult("CPF já cadastrado");
            }

            return ValidationResult.Success!;
        }
    }

    public class UniqueEmailAttribute : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            if (value == null || string.IsNullOrWhiteSpace(value.ToString()))
            {
                return ValidationResult.Success!;
            }

            var service = validationContext.GetService(typeof(FinansableAPI.Application.Interfaces.IUsuarioService)) 
                as FinansableAPI.Application.Interfaces.IUsuarioService;

            if (service == null)
            {
                return ValidationResult.Success!;
            }

            var existingUser = service.GetByEmailAsync(value.ToString()!).Result;
            
            if (existingUser != null)
            {
                return new ValidationResult("Email já cadastrado");
            }

            return ValidationResult.Success!;
        }
    }
}