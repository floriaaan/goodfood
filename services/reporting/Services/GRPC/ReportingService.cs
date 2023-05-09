using Grpc.Core;
using MetricModel = reporting.Models.Metric;
using MetricGrpc = reporting.Metric;


namespace reporting.Services.GRPC;


public class ReportingService : reporting.ReportingService.ReportingServiceBase
{
    private readonly ILogger<ReportingService> _logger;
    private readonly ReportingContext _db;
    public ReportingService(ILogger<ReportingService> logger)
    {
        _logger = logger;
        _db = new ReportingContext();

    }

    private void LogRequest<T>(T request, ServerCallContext context)
    {
        string Date = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
        string Method = context.Method.Split('.').Last();
        string RequestBody = request?.ToString() ?? "null";

        _logger.LogInformation("\x1b[35m{Date}\x1b[0m | \x1b[36mGRPC\x1b[0m | \x1b[33m{Message}\x1b[0m\n", Date, Method + " with: " + RequestBody);
    }



    public override Task<MetricGrpc> GetMetric(GetMetricRequest request, ServerCallContext context)
    {
        LogRequest(request, context);

        MetricModel? metric = MetricModel.GetMetricByKey(request.Key);
        if (metric == null)
            throw new RpcException(new Status(StatusCode.NotFound, "Metric not found"));

        return Task.FromResult(metric.ToGrpcMetric());
    }

    public override Task<GetMetricsByRestaurantResponse> GetMetricsByRestaurant(GetMetricsByRestaurantRequest request, ServerCallContext context)
    {
        LogRequest(request, context);

        List<MetricModel> metrics = MetricModel.GetMetricsByRestaurant(request.RestaurantId);
        List<MetricGrpc> response = metrics.Select(m => m.ToGrpcMetric()).ToList();

        // WARNING: this returns an empty object if no metrics are found
        return Task.FromResult(new GetMetricsByRestaurantResponse { Metrics = { response } });
    }

    public override Task<GetMetricsByRestaurantAndDateResponse> GetMetricsByRestaurantAndDate(GetMetricsByRestaurantAndDateRequest request, ServerCallContext context)
    {
        LogRequest(request, context);

        List<MetricModel> metrics = MetricModel.GetMetricsByRestaurantAndDate(request.RestaurantId, request.Date);
        List<MetricGrpc> response = metrics.Select(m => m.ToGrpcMetric()).ToList();

        // WARNING: this returns an empty object if no metrics are found
        return Task.FromResult(new GetMetricsByRestaurantAndDateResponse { Metrics = { response } });
    }

    public override Task<PushMetricResponse> PushMetric(PushMetricRequest request, ServerCallContext context)
    {
        LogRequest(request, context);

        MetricModel metric = MetricModel.FromGrpcPushMetric(request).SaveMetric();

        return Task.FromResult(new PushMetricResponse { Key = metric.Key });
    }
}
