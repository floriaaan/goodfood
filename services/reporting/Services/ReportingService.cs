using Grpc.Core;

namespace reporting.Services;


public class ReportingService : reporting.ReportingService.ReportingServiceBase
{
    private readonly ILogger<ReportingService> _logger;
    private readonly ReportingContext _db;
    public ReportingService(ILogger<ReportingService> logger)
    {
        _logger = logger;
        _db = new ReportingContext();

    }

    public override Task<Metric> GetMetric(GetMetricRequest request, ServerCallContext context)
    {
        Models.Metric? metric = _db.Metrics.FirstOrDefault(m => m.Key == request.Key);
        if (metric == null)
            throw new RpcException(new Status(StatusCode.NotFound, "Metric not found"));

        return Task.FromResult(new Metric
        {
            Id = metric.Id.ToString(),
            Key = metric.Key,
            RestaurantId = metric.RestaurantId,
            Date = Google.Protobuf.WellKnownTypes.Timestamp.FromDateTime(metric.Date),
            Code = metric.Code,
            Value = metric.Value
        });
    }

    public override Task<PushMetricResponse> PushMetric(PushMetricRequest request, ServerCallContext context)
    {

        String date = DateTime.Now.Date.ToString("yyyy-MM-dd");
        Models.Metric metric = new Models.Metric
        {
            Key = request.RestaurantId + ":" + date + ":" + request.Code,
            RestaurantId = request.RestaurantId,
            Date = Google.Protobuf.WellKnownTypes.Timestamp.FromDateTime(DateTime.UtcNow).ToDateTime(),
            Code = request.Code,
            Value = request.Value
        };

        _db.Metrics.Add(metric);
        _db.SaveChanges();

        return Task.FromResult(new PushMetricResponse { Key = metric.Key });
    }
}
