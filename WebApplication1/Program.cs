using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;

//On cree un objet à partir des arguments de la ligne de comande 
var builder = WebApplication.CreateBuilder(args);

// Ajouter les services au conteneur.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "API de Contrôle Optimal", Version = "v1" });
});
//apres on doit ajouter d'autre truc pour coloration aussi 

//Le CORS est un mécanisme qui consiste à ajouter des en-têtes
//HTTP afin de permettre à un agent utilisateur d'accéder à
//des ressources d'un serveur situé sur une autre origine que le site courant.

// Configurer CORS pour autoriser les requêtes du frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

//construction de l'application 
var app = builder.Build();

// Configurer le pipeline de requêtes HTTP.
//la série d'étapes que chaque requête HTTP traverse lorsqu'elle est reçue par l'application ASP.NET Core
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "API de Contrôle Optimal v1");
    });
}

// Activer le middleware CORS
app.UseCors("AllowAll");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
