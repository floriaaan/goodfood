using reporting.Libraries.RabbitMQ;
using ReportingServiceGRPC = reporting.Services.GRPC.ReportingService;


namespace reporting.Services.RabbitMQ;


public class ReportingService : reporting.ReportingService.ReportingServiceBase
{

    private readonly RabbitMQClient _client;
    private readonly ILogger<ReportingServiceGRPC> _logger;
    public ReportingService(ILogger<ReportingServiceGRPC> logger)
    {
        _logger = logger;
        _client = new RabbitMQClient("log");

    }

    public void LogRequest<T>(string Method, T Request)
    {
        string Date = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
        string RequestBody = Request?.ToString() ?? "null";

        _logger.LogInformation("\x1b[35m{Date}\x1b[0m | \x1b[31mAMQP\x1b[0m | \x1b[33m{Message}\x1b[0m\n", Date, RequestBody);
        _client.Publish(Method, Request);
    }



    public void AskFor()
    {
        // LogRequest(request);


    }
}
