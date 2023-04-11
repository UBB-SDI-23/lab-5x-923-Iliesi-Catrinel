using Microsoft.EntityFrameworkCore;
using MuseumAPI.Context;
using MuseumAPI.Utils;
using MuseumAPI.Validation;
using System.Text.Json.Serialization;

namespace PaintingsAPI
{
    public class Program
    {
        static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // add services to the container
            //builder.Services.AddControllers().AddJsonOptions(options => options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));
            // builder.Services.AddControllers();

            builder.Services.AddControllers().AddNewtonsoftJson(options => options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);

            var connectionString = builder.Configuration.GetConnectionString("LocalMuseumCS");
            if (string.IsNullOrEmpty(connectionString))
                connectionString = builder.Configuration.GetConnectionString("MuseumCS");

            // add the database context to the DI container
            // and specify that the database context will use a sql server database
            builder.Services.AddDbContext<MuseumContext>(options => options.UseSqlServer(connectionString));

            // add endpoints
            builder.Services.AddEndpointsApiExplorer();

            // add swagger
            builder.Services.AddSwaggerGen();

            builder.Services.ConfigureSwaggerGen(setup =>
            {
                setup.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
                {
                    Title = "Museum Management",
                    Version = "v1"
                });
            });

            var app = builder.Build();

            // seed database
            using (var scope = app.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                SeedData.Initialize(services);
            }

            app.UseSwagger();
            app.UseSwaggerUI();
            // configure the HTTP request pipeline for swagger
            if (app.Environment.IsDevelopment())
            {
                ;
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
