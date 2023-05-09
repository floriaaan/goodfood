using Grpc.Core;
using MetricModel = reporting.Models.Metric;
using MetricGrpc = reporting.Metric;


namespace reporting.Services.RabbitMQ;


public class ReportingService : reporting.ReportingService.ReportingServiceBase
{
    private readonly ILogger<ReportingService> _logger;
    private readonly ReportingContext _db;
    public ReportingService(ILogger<ReportingService> logger)
    {
        _logger = logger;
        _db = new ReportingContext();

    }

    private void LogRequest<T>(T request)
    {
        string Date = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
        string RequestBody = request?.ToString() ?? "null";

        _logger.LogInformation("\x1b[35m{Date}\x1b[0m | \x1b[31mAMQP\x1b[0m | \x1b[33m{Message}\x1b[0m\n", Date);
    }



    public void AskFor()
    {
        // LogRequest(request);


    }
}
