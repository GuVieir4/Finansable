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

        public async Task AddAsync(CreateUsuarioDTO usuarioDto)
        {
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
            var usuario = await _usuarioRepository.GetAllAsync();
            var user = usuario.FirstOrDefault(u => u.Email == email && u.Senha == senha);
            if (user == null)
            {
                return null;
            }

            return new UsuarioDTO
            {
                Id = user.Id,
                Nome = user.Nome,
                CPF = user.CPF,
                Email = user.Email,
                TipoUsuario = user.TipoUsuario
            };
        }
    }
}