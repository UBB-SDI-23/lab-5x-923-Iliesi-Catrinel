using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MuseumAPI.Context;
using MuseumAPI.Models;
using MuseumAPI.Utils;
using MuseumAPI.Services;
using MuseumAPI.Validation;
using System.Text;
using System.Text.Json.Serialization;

namespace PaintingsAPI
{
    public class Program
    {
        static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddCors(options =>
            {
                options.AddDefaultPolicy(policy =>
                {
                    policy.WithOrigins("https://museumapi-frontend.netlify.app")
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
            });

            // add services to the container
            //builder.Services.AddControllers().AddJsonOptions(options => options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));
            // builder.Services.AddControllers();

            //builder.Services.AddControllers().AddNewtonsoftJson(options => options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);

            builder.Services.AddHostedService<ExpiredConfirmationCodeCleanupService>();

            builder.Services.AddControllers(options =>
            {
                var policy = new AuthorizationPolicyBuilder()
                    .RequireAuthenticatedUser()
                    .Build();
                options.Filters.Add(new AuthorizeFilter(policy));
            })
                .AddJsonOptions(options => options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()))
                .AddNewtonsoftJson(options => options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore)
            ;

            var jwtSettingsSection = builder.Configuration.GetSection("JwtSettings");
            builder.Services.Configure<JwtSettings>(jwtSettingsSection);
            var jwtSettings = jwtSettingsSection.Get<JwtSettings>();

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtSettings!.Secret)),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };
            });


            var connectionString = builder.Configuration.GetConnectionString("MuseumCS");

            // add the database context to the DI container
            // and specify that the database context will use a sql server database
            //builder.Services.AddDbContext<MuseumContext>(options => options.UseSqlServer(connectionString));

            builder.Services.AddDbContext<MuseumContext>(options =>
            {
                options.UseSqlServer(connectionString, sqlOptions =>
                {
                    sqlOptions.CommandTimeout(120); // Set the command timeout to 60 seconds
                });
            });


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

            int retryCount = 0;
            while (retryCount < 6)
            {
                try
                {
                    using (var scope = app.Services.CreateScope())
                    {
                        var context = scope.ServiceProvider.GetService<MuseumContext>();
                        context!.Database.Migrate();
                        SeedData.InitializeAsync(scope.ServiceProvider).Wait();
                    }

                    break;
                }
                catch (Exception)
                {
                    retryCount++;
                    if (retryCount >= 6)
                        throw;

                    Thread.Sleep(10000);
                }
            }

            app.UseSwagger();
            app.UseSwaggerUI();
            // configure the HTTP request pipeline for swagger
            if (app.Environment.IsDevelopment())
            {
                ;
            }

            app.UseHttpsRedirection();
            app.UseAuthentication();
            
            app.UseCors();
            app.UseAuthorization();

            app.MapControllers();
            app.Run();
        }
    }
}
