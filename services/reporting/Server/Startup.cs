using ReportingServiceGRPC = reporting.Services.GRPC.ReportingService;
using System.Net;
using reporting.Models;

public class Startup
{
    public IConfigurationRoot Config { get; set; }
    
    public Startup()
    {
        var builder = new ConfigurationBuilder()
            .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
            .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);

        Config = builder.Build();
    }
    
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddGrpc();
        services.AddGrpcReflection();
        services.AddScoped<ReportingServiceGRPC>();
        services.Configure<Config>(Config);
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment()) app.UseDeveloperExceptionPage();

        app.UseRouting();

        app.UseEndpoints(endpoints =>
        {
            String ip = Dns.GetHostEntry(Dns.GetHostName()).AddressList[0].ToString();

            Console.WriteLine("---- \x1b[32mgood\x1b[0m\x1b[33mfood\x1b[0m Reporting Service ----");
            Console.WriteLine($"started on: \x1b[1m{ip}\x1b[0m \x1b[✓\x1b[0m");

            endpoints.MapGrpcService<ReportingServiceGRPC>();
            endpoints.MapGrpcReflectionService();
            endpoints.MapFallback("/", async context =>
            {
                await context.Response.WriteAsync("Communication with gRPC endpoints must be made through a gRPC client.");
            });
        });
    }
}