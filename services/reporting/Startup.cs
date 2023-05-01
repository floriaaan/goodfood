using reporting.Services;
using reporting.Libraries.RabbitMQ;
using System.Net;

public class Startup
{

    private RabbitMQClient _logClient = new RabbitMQClient("log");

    public void ConfigureServices(IServiceCollection services)
    {
        services.AddGrpc();
        services.AddGrpcReflection();
        services.AddScoped<GreeterService>();
        services.AddScoped<ReportingService>();
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


            /**
                * TODO: add AMQP listeners
                *  - implement > publish to `log` queue every request
                *  - implement > subscribe to every metric code queue (todo: define queue names)
                * TODO: add health check
            */


            endpoints.MapGrpcService<GreeterService>();
            endpoints.MapGrpcService<ReportingService>();
            endpoints.MapGrpcReflectionService();
            endpoints.MapFallback("/", async context =>
            {
                await context.Response.WriteAsync("Communication with gRPC endpoints must be made through a gRPC client.");
            });
        });
    }
}