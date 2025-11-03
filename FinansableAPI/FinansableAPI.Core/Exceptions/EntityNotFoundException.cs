namespace FinansableAPI.Core.Exceptions
{
    public class EntityNotFoundException : Exception
    {
        public EntityNotFoundException(string message) : base(message)
        {
        }

        public EntityNotFoundException(string entityName, int id)
            : base($"{entityName} com ID {id} não encontrado")
        {
        }
    }
}