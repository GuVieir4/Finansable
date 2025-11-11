using FinansableAPI.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;

namespace FinansableAPI.Infrastructure.Persistence
{
    public class FinansableDbContext : DbContext
    {
        public FinansableDbContext(DbContextOptions<FinansableDbContext> options) : base(options)
        {
        }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Poupanca> Poupancas { get; set; }
        public DbSet<Transacao> Transacoes { get; set; }
        public DbSet<Mensagem> Mensagens { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Define primary keys
            modelBuilder.Entity<Usuario>().HasKey(u => u.Id);
            modelBuilder.Entity<Poupanca>().HasKey(p => p.Id);
            modelBuilder.Entity<Transacao>().HasKey(t => t.Id);

            // Define relationships
            modelBuilder.Entity<Poupanca>()
                .HasOne<Usuario>()
                .WithMany()
                .HasForeignKey(p => p.UsuarioId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Transacao>()
                .HasOne<Usuario>()
                .WithMany()
                .HasForeignKey(t => t.UsuarioId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Transacao>()
                .HasOne<Poupanca>()
                .WithMany()
                .HasForeignKey(t => t.PoupancaId)
                .OnDelete(DeleteBehavior.SetNull);

            // Seed data
            modelBuilder.Entity<Usuario>().HasData(
                new Usuario
                {
                    Id = 1,
                    Nome = "João Silva",
                    CPF = "12345678901",
                    Email = "joao.silva@email.com",
                    Senha = "senha123",
                    TipoUsuario = 1
                },
                new Usuario
                {
                    Id = 2,
                    Nome = "Maria Santos",
                    CPF = "98765432100",
                    Email = "maria.santos@email.com",
                    Senha = "senha456",
                    TipoUsuario = 2
                },
                new Usuario
                {
                    Id = 3,
                    Nome = "Pedro Oliveira",
                    CPF = "45678912345",
                    Email = "pedro.oliveira@email.com",
                    Senha = "senha789",
                    TipoUsuario = 1
                }
            );
        }
    }
}