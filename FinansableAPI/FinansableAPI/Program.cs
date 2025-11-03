using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure DbContext
string mySqlConnection = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<FinansableAPI.Infrastructure.Persistence.FinansableDbContext>(options =>
    options.UseMySql(mySqlConnection, ServerVersion.AutoDetect(mySqlConnection)));

// Ensure database is created and seeded
using (var scope = builder.Services.BuildServiceProvider().CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<FinansableAPI.Infrastructure.Persistence.FinansableDbContext>();
    dbContext.Database.EnsureCreated();
}

// Configure dependency injection
builder.Services.AddScoped<FinansableAPI.Application.Interfaces.IUsuarioService, FinansableAPI.Application.Services.UsuarioService>();
builder.Services.AddScoped<FinansableAPI.Core.Ports.IUsuarioRepository, FinansableAPI.Infrastructure.Persistence.Repositories.UsuarioRepository>();
builder.Services.AddScoped<FinansableAPI.Application.Interfaces.IPoupancaService, FinansableAPI.Application.Services.PoupancaService>();
builder.Services.AddScoped<FinansableAPI.Core.Ports.IPoupancaRepository, FinansableAPI.Infrastructure.Persistence.Repositories.PoupancaRepository>();
builder.Services.AddScoped<FinansableAPI.Application.Interfaces.ITransacaoService, FinansableAPI.Application.Services.TransacaoService>();
builder.Services.AddScoped<FinansableAPI.Core.Ports.ITransacaoRepository, FinansableAPI.Infrastructure.Persistence.Repositories.TransacaoRepository>();

builder.Services.AddControllers();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.UseCors("AllowAll");

app.MapControllers();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
