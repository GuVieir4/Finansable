using FinansableAPI.Application.DTOs;
using FinansableAPI.Application.Interfaces;
using FinansableAPI.Core.Entities;
using FinansableAPI.Core.Exceptions;
using FinansableAPI.Core.Ports;

namespace FinansableAPI.Application.Services
{
    public class UsuarioService : IUsuarioService
    {
        private readonly IUsuarioRepository _usuarioRepository;

        public UsuarioService(IUsuarioRepository usuarioRepository)
        {
            _usuarioRepository = usuarioRepository;
        }

        public async Task<UsuarioDTO> GetByIdAsync(int id)
        {
            var usuario = await _usuarioRepository.GetByIdAsync(id);
            if (usuario == null)
            {
                throw new EntityNotFoundException("Usuário", id);
            }

            return new UsuarioDTO
            {
                Id = usuario.Id,
                Nome = usuario.Nome,
                CPF = usuario.CPF,
                Email = usuario.Email,
                TipoUsuario = usuario.TipoUsuario
            };
        }

        public async Task<IEnumerable<UsuarioDTO>> GetAllAsync()
        {
            var usuarios = await _usuarioRepository.GetAllAsync();
            return usuarios.Select(u => new UsuarioDTO
            {
                Id = u.Id,
                Nome = u.Nome,
                CPF = u.CPF,
                Email = u.Email,
                TipoUsuario = u.TipoUsuario
            });
        }

        public async Task<UsuarioDTO?> GetByEmailAsync(string email)
        {
            var usuario = await _usuarioRepository.GetByEmailAsync(email);
            if (usuario == null)
            {
                return null;
            }

            return new UsuarioDTO
            {
                Id = usuario.Id,
                Nome = usuario.Nome,
                CPF = usuario.CPF,
                Email = usuario.Email,
                TipoUsuario = usuario.TipoUsuario
            };
        }

        public async Task<UsuarioDTO?> GetByCpfAsync(string cpf)
        {
            var usuario = await _usuarioRepository.GetByCpfAsync(cpf);
            if (usuario == null)
            {
                return null;
            }

            return new UsuarioDTO
            {
                Id = usuario.Id,
                Nome = usuario.Nome,
                CPF = usuario.CPF,
                Email = usuario.Email,
                TipoUsuario = usuario.TipoUsuario
            };
        }

        public async Task AddAsync(CreateUsuarioDTO usuarioDto)
        {
            // Verifica se email já existe
            var existingEmail = await _usuarioRepository.GetByEmailAsync(usuarioDto.Email);
            if (existingEmail != null)
            {
                throw new ArgumentException("Email já cadastrado");
            }

            // Verifica se CPF já existe
            var existingCpf = await _usuarioRepository.GetByCpfAsync(usuarioDto.CPF);
            if (existingCpf != null)
            {
                throw new ArgumentException("CPF já cadastrado");
            }

            // Verifica se a senha tem pelo menos 8 caracteres
            if (usuarioDto.Senha.Length < 8)
            {
                throw new ArgumentException("Senha deve ter pelo menos 8 caracteres");
            }

            // Verifica se a senha tem pelo menos um caractere especial
            if (!usuarioDto.Senha.Any(c => "!@#$%^&*()_+-=[]{}|;:,.<>?".Contains(c)))
            {
                throw new ArgumentException("Senha deve conter pelo menos um caractere especial");
            }

            // Verifica se o CPF é válido
            if (!FinansableAPI.Core.Validations.CpfValidation.IsValid(usuarioDto.CPF))
            {
                throw new ArgumentException("CPF inválido");
            }

            var usuario = new Usuario
            {
                Nome = usuarioDto.Nome,
                CPF = usuarioDto.CPF,
                Email = usuarioDto.Email,
                Senha = usuarioDto.Senha,
                TipoUsuario = usuarioDto.TipoUsuario
            };
            await _usuarioRepository.AddAsync(usuario);
        }

        public async Task UpdateAsync(UpdateUsuarioDTO usuarioDto)
        {
            var usuario = new Usuario
            {
                Id = usuarioDto.Id,
                Nome = usuarioDto.Nome,
                CPF = usuarioDto.CPF,
                Email = usuarioDto.Email,
                Senha = usuarioDto.Senha,
                TipoUsuario = usuarioDto.TipoUsuario
            };
            await _usuarioRepository.UpdateAsync(usuario);
        }

        public async Task DeleteAsync(int id)
        {
            await _usuarioRepository.DeleteAsync(id);
        }

        public async Task<UsuarioDTO?> AuthenticateAsync(string email, string senha)
        {
            var usuario = await _usuarioRepository.GetByEmailAsync(email);
            if (usuario == null || usuario.Senha != senha)
            {
                return null;
            }

            return new UsuarioDTO
            {
                Id = usuario.Id,
                Nome = usuario.Nome,
                CPF = usuario.CPF,
                Email = usuario.Email,
                TipoUsuario = usuario.TipoUsuario
            };
        }
    }
}