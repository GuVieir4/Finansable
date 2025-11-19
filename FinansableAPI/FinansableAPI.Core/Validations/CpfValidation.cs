using System;
using System.Linq;

namespace FinansableAPI.Core.Validations
{
    public static class CpfValidation
    {
        public static bool IsValid(string cpf)
        {
            if (string.IsNullOrWhiteSpace(cpf))
                return false;

            // Remove caracteres não numéricos
            cpf = cpf.Replace(".", "").Replace("-", "");
            
            // Verifica se tem 11 dígitos
            if (cpf.Length != 11)
                return false;

            // Verifica se todos os dígitos são iguais
            if (cpf.All(d => d == cpf[0]))
                return false;

            // Calcula o primeiro dígito verificador
            int sum = 0;
            for (int i = 0; i < 9; i++)
            {
                sum += int.Parse(cpf[i].ToString()) * (10 - i);
            }
            int remainder = sum % 11;
            int firstDigit = remainder < 2 ? 0 : 11 - remainder;

            if (int.Parse(cpf[9].ToString()) != firstDigit)
                return false;

            // Calcula o segundo dígito verificador
            sum = 0;
            for (int i = 0; i < 10; i++)
            {
                sum += int.Parse(cpf[i].ToString()) * (11 - i);
            }
            remainder = sum % 11;
            int secondDigit = remainder < 2 ? 0 : 11 - remainder;

            return int.Parse(cpf[10].ToString()) == secondDigit;
        }
    }
}