using FinansableAPI.Application.DTOs;
using FinansableAPI.Application.Interfaces;
using FinansableAPI.Core.Entities;
using FinansableAPI.Core.Ports;
using Microsoft.Extensions.Configuration;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace FinansableAPI.Application.Services
{
    public class MensagemService : IMensagemService
    {
        private readonly IMensagemRepository _mensagemRepository;
        private readonly IConfiguration _configuration;
        private readonly ITransacaoService _transacaoService;
        private readonly IPoupancaService _poupancaService;

        public MensagemService(IMensagemRepository mensagemRepository, IConfiguration configuration, ITransacaoService transacaoService, IPoupancaService poupancaService)
        {
            _mensagemRepository = mensagemRepository;
            _configuration = configuration;
            _transacaoService = transacaoService;
            _poupancaService = poupancaService;
        }

        public async Task<IEnumerable<MensagemDTO>> CriarMensagemAsync(string texto, DirecaoMensagem direcao, int? usuarioId)
        {
            var mensagens = new List<MensagemDTO>();

            var userMensagem = new Mensagem
            {
                Texto = texto,
                Direcao = direcao,
                UsuarioId = usuarioId,
                DataEnvio = DateTime.Now
            };

            var savedUserMensagem = await _mensagemRepository.AddAsync(userMensagem);

            mensagens.Add(new MensagemDTO
            {
                Id = savedUserMensagem.Id,
                DataEnvio = savedUserMensagem.DataEnvio,
                Texto = savedUserMensagem.Texto,
                Direcao = savedUserMensagem.Direcao,
                UsuarioId = savedUserMensagem.UsuarioId
            });

            if (direcao == DirecaoMensagem.Enviada)
            {
                // Call Groq AI
                var aiResponse = await CallGroqAIAsync(texto);
                var aiResult = JsonSerializer.Deserialize<AiResponse>(aiResponse);

                if (aiResult != null)
                {
                    if (aiResult.Action == "create_transaction")
                    {
                        await _transacaoService.AddAsync(new CreateTransacaoDTO
                        {
                            Nome = aiResult.Data.Nome,
                            Valor = aiResult.Data.Valor,
                            TipoCategoria = aiResult.Data.TipoCategoria,
                            TipoMeioPagamento = aiResult.Data.TipoMeioPagamento ?? 0,
                            TipoMovimentacao = aiResult.Data.TipoMovimentacao,
                            Data = aiResult.Data.Data ?? DateTime.Now,
                            UsuarioId = usuarioId.Value,
                            PoupancaId = aiResult.Data.PoupancaId
                        });
                    }
                    else if (aiResult.Action == "create_goal")
                    {
                        await _poupancaService.AddAsync(new CreatePoupancaDTO
                        {
                            Nome = aiResult.Data.Nome,
                            ValorAlvo = aiResult.Data.ValorAlvo,
                            ValorAtual = aiResult.Data.ValorAtual ?? 0,
                            DataInicio = aiResult.Data.DataInicio ?? DateTime.Now,
                            DataFim = aiResult.Data.DataFim,
                            UsuarioId = usuarioId.Value
                        });
                    }

                    // Save bot message
                    var botMensagem = new Mensagem
                    {
                        Texto = aiResult.Message,
                        Direcao = DirecaoMensagem.Recebida,
                        UsuarioId = usuarioId,
                        DataEnvio = DateTime.Now
                    };

                    var savedBotMensagem = await _mensagemRepository.AddAsync(botMensagem);

                    mensagens.Add(new MensagemDTO
                    {
                        Id = savedBotMensagem.Id,
                        DataEnvio = savedBotMensagem.DataEnvio,
                        Texto = savedBotMensagem.Texto,
                        Direcao = savedBotMensagem.Direcao,
                        UsuarioId = savedBotMensagem.UsuarioId
                    });
                }
            }

            return mensagens;
        }

        public async Task<IEnumerable<MensagemDTO>> ListarMensagensUsuarioAsync(int usuarioId)
        {
            var mensagens = await _mensagemRepository.GetByUsuarioIdAsync(usuarioId);

            return mensagens.Select(m => new MensagemDTO
            {
                Id = m.Id,
                DataEnvio = m.DataEnvio,
                Texto = m.Texto,
                Direcao = m.Direcao,
                UsuarioId = m.UsuarioId
            });
        }

        private async Task<string> CallGroqAIAsync(string userMessage)
        {
            var requestBody = new
            {
                user_message = userMessage
            };

            using var client = new HttpClient();
            var json = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var groqServiceUrl = $"{_configuration["GroqService:BaseUrl"]}/groq/chat";
            var response = await client.PostAsync(groqServiceUrl, content);
            response.EnsureSuccessStatusCode();

            var responseJson = await response.Content.ReadAsStringAsync();
            var groqServiceResponse = JsonSerializer.Deserialize<GroqServiceResponse>(responseJson);

            // Convert the response back to the expected format for the existing code
            return JsonSerializer.Serialize(new
            {
                action = groqServiceResponse.Action,
                data = groqServiceResponse.Data,
                message = groqServiceResponse.Message
            });
        }

        private class GroqResponse
        {
            public Choice[] Choices { get; set; }
            public class Choice
            {
                public GroqMessage Message { get; set; }
            }
            public class GroqMessage
            {
                public string Content { get; set; }
            }
        }

        private class AiResponse
        {
            public string Action { get; set; }
            public AiData Data { get; set; }
            public string Message { get; set; }
        }

        private class AiData
        {
            public string Nome { get; set; }
            public decimal Valor { get; set; }
            public int TipoCategoria { get; set; }
            public int? TipoMeioPagamento { get; set; }
            public int TipoMovimentacao { get; set; }
            public DateTime? Data { get; set; }
            public int? PoupancaId { get; set; }
            public decimal ValorAlvo { get; set; }
            public decimal? ValorAtual { get; set; }
            public DateTime? DataInicio { get; set; }
            public DateTime? DataFim { get; set; }
        }

        private class GroqServiceResponse
        {
            public string Action { get; set; }
            public object Data { get; set; }
            public string Message { get; set; }
        }
    }
}