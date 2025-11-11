using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FinansableAPI.Core.Entities
{
    public class Mensagem
    {

        public int Id { get; set; }
        public DateTime DataEnvio { get; set; }
        public string Texto { get; set; }
        public DirecaoMensagem Direcao { get; set; }
        public int? UsuarioId { get; set; }
        public Usuario? Usuario { get; set; }
    }

    public enum DirecaoMensagem
    {
        Enviada=1,
        Recebida=2
    }

}
