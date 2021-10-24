using System.IdentityModel.Tokens.Jwt;
using System.Threading.Tasks;
using Backend.Api.Auth;
using Backend.Api.Data;
using Backend.Api.Hubs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

namespace Backend.Api
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }
        

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
           
            services
                .AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters()
                    {
                        ValidateIssuer = true,
                        ValidIssuer = AuthOptions.Issuer,
                        ValidateAudience = true,
                        ValidAudience = AuthOptions.Audience,
                        ValidateLifetime = true,
                        IssuerSigningKey = AuthOptions.GetSymmetricSecurityKey(),
                        ValidateIssuerSigningKey = true
                    };
                    options.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            var accessToken = context.Request.Query["access_token"];

                            var path = context.HttpContext.Request.Path;
                            if (!string.IsNullOrEmpty(accessToken) &&
                                (path.StartsWithSegments("/hub/main")))
                            {
                                context.Token = accessToken;
                            }

                            return Task.CompletedTask;
                        }
                    };
                });


            services.AddCors(options =>
            {
                options.AddPolicy("CustomPolicy", builder =>
                {
                    builder.WithOrigins("http://localhost:3000", "https://localhost:3000").AllowCredentials()
                        .AllowAnyHeader().AllowAnyMethod();
                });
            });
            
            services.AddAutoMapper(typeof(Startup).Assembly); 
            
            services.AddTransient<IMessagesRepository, MessagesRepository>(_ =>
                new MessagesRepository(Configuration.GetConnectionString("Postgres")));  
            
            services.AddTransient<IUsersRepository, UsersRepository>(_ =>
                new UsersRepository(Configuration.GetConnectionString("Postgres")));
            
            services.AddTransient<IChatsRepository, ChatsRepository>(_ =>
                new ChatsRepository(Configuration.GetConnectionString("Postgres")));
            
            services.AddTransient<IFilesRepository, FilesRepository>(_ =>
                new FilesRepository(Configuration.GetConnectionString("Postgres")));

            services.AddControllers();
            services.AddSignalR();
            
            services.AddSpaStaticFiles(configuration => { configuration.RootPath = "ClientApp/build"; });

            services.AddSwaggerGen(
                c => { c.SwaggerDoc("v1", new OpenApiInfo { Title = "Backend.Api", Version = "v1" }); }
            );
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Backend.Api v1"));
            }
            
            Dapper.DefaultTypeMap.MatchNamesWithUnderscores = true;

            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

            app.UseCors("CustomPolicy");
            
            app.UseHttpsRedirection();

            app.UseRouting();
            
            app.UseAuthentication();
            app.UseAuthorization();
            
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<MainHub>("/hub/main");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";
                spa.Options.DevServerPort = 3000;

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer("start");
                    spa.UseProxyToSpaDevelopmentServer("http://localhost:3000");
                }
            });
        }
    }
}