using Com.Goodfood.Reporting;
using Grpc.Core;
using Microsoft.Extensions.Options;
using reporting.Models;
using reporting.Libraries.RabbitMQ;

namespace reporting.Services.GRPC;

public class ReportingService : Com.Goodfood.Reporting.ReportingService.ReportingServiceBase
{
    private readonly ILogger<ReportingService> _logger;
    private readonly ReportingContext _db;
    private readonly RabbitMQClient _amqp;
    public ReportingService(ILogger<ReportingService> logger, IOptions<Config> config)
    {
        _logger = logger;
        _db = new ReportingContext(config);
        _amqp = new RabbitMQClient("log");
        
        MetricObject._config = config;
        RestaurantObject._config = config;
        RestaurantGroupObject._config = config;
    }

    private void LogRequest<T>(T Request, ServerCallContext Context)
    {
        string Date = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
        string Method = Context.Method.Split('.').Last();
        string RequestBody = Request?.ToString() ?? "null";

        _logger.LogInformation("\x1b[35m{Date}\x1b[0m | \x1b[36mGRPC\x1b[0m | \x1b[33m{Message}\x1b[0m\n", Date, Method + " with: " + RequestBody);
        _amqp.Publish(Method, Request);
    }

    #region Metric
    public override Task<Metric> GetMetric(GetMetricRequest request, ServerCallContext context)
    {
        try
        {
            MetricObject? metric = MetricObject.GetMetricByKey(request.Key);
            if (metric == null)
                throw new RpcException(new Status(StatusCode.NotFound, "Metric not found"));

            LogRequest(request, context);
            return Task.FromResult(metric.ToGrpcMetric());
        }
        catch (Exception e)
        {
            LogRequest("\"" + e.Message + "\"", context);
            throw new RpcException(new Status(StatusCode.Internal, e.Message));
        }
    }

    public override Task<GetMetricsByRestaurantResponse> GetMetricsByRestaurant(GetMetricsByRestaurantRequest request, ServerCallContext context)
    {
        try
        {

            List<MetricObject> metrics = MetricObject.GetMetricsByRestaurant(request.RestaurantId);
            List<Metric> response = metrics.Select(m => m.ToGrpcMetric()).ToList();

            LogRequest(request, context);
            // WARNING: this returns an empty object if no metrics are found
            return Task.FromResult(new GetMetricsByRestaurantResponse { Metrics = { response } });
        }
        catch (Exception e)
        {
            LogRequest("\"" + e.Message + "\"", context);
            throw new RpcException(new Status(StatusCode.Internal, e.Message));
        }
    }

    public override Task<GetMetricsByRestaurantAndDateResponse> GetMetricsByRestaurantAndDate(GetMetricsByRestaurantAndDateRequest request, ServerCallContext context)
    {
        try
        {
            List<MetricObject> metrics = MetricObject.GetMetricsByRestaurantAndDate(request.RestaurantId, request.Date);
            List<Metric> response = metrics.Select(m => m.ToGrpcMetric()).ToList();

            LogRequest(request, context);
            // WARNING: this returns an empty object if no metrics are found
            return Task.FromResult(new GetMetricsByRestaurantAndDateResponse { Metrics = { response } });
        }
        catch (Exception e)
        {
            LogRequest("\"" + e.Message + "\"", context);
            throw new RpcException(new Status(StatusCode.Internal, e.Message));
        }
    }

    public override Task<GetMetricsByRestaurantGroupResponse> GetMetricsByRestaurantGroup(GetMetricsByRestaurantGroupRequest request, ServerCallContext context)
    {
        try
        {
            List<MetricObject> metrics = MetricObject.GetMetricsByRestaurantGroup(request.RestaurantGroupId);
            List<Metric> response = metrics.Select(m => m.ToGrpcMetric()).ToList();

            LogRequest(request, context);
            // WARNING: this returns an empty object if no metrics are found
            return Task.FromResult(new GetMetricsByRestaurantGroupResponse { Metrics = { response } });
        }
        catch (Exception e)
        {
            LogRequest("\"" + e.Message + "\"", context);
            throw new RpcException(new Status(StatusCode.Internal, e.Message));
        }
    }

    public override Task<PushMetricResponse> PushMetric(PushMetricRequest request, ServerCallContext context)
    {

        try
        {
            MetricObject metricObject = MetricObject.FromGrpcPushMetric(request).Save();

            LogRequest(request, context);
            return Task.FromResult(new PushMetricResponse { Key = metricObject.Key });
        }
        catch (Exception e)
        {
            LogRequest("\"" + e.Message + "\"", context);
            throw new RpcException(new Status(StatusCode.Internal, e.Message));
        }
    }

    #endregion

    #region Restaurant
    public override Task<Restaurant> GetRestaurant(GetRestaurantRequest request, ServerCallContext context)
    {
        try
        {
            RestaurantObject? restaurant = RestaurantObject.GetRestaurant(request.Id);
            if (restaurant == null)
                throw new RpcException(new Status(StatusCode.NotFound, "Restaurant not found"));

            LogRequest(request, context);
            return Task.FromResult(restaurant.ToGrpcRestaurantMetric());
        }
        catch (Exception e)
        {
            LogRequest("\"" + e.Message + "\"", context);
            throw new RpcException(new Status(StatusCode.Internal, e.Message));
        }
    }

    public override Task<Restaurant> CreateRestaurant(CreateRestaurantRequest request, ServerCallContext context)
    {
        try
        {
            RestaurantObject restaurantObject = RestaurantObject.FromGrpc(request).Save();
            LogRequest(request, context);
            return Task.FromResult(restaurantObject.ToGrpcRestaurantMetric());
        }
        catch (Exception e)
        {
            LogRequest("\"" + e.Message + "\"", context);
            throw new RpcException(new Status(StatusCode.Internal, e.Message));
        }
    }

    public override Task<Restaurant> UpdateRestaurant(UpdateRestaurantRequest request, ServerCallContext context)
    {
        try
        {
            LogRequest(request, context);
            RestaurantObject? restaurant = RestaurantObject.FromUpdateGrpc(request).Update();
            return Task.FromResult(restaurant.ToGrpcRestaurantMetric());
        }
        catch (Exception e)
        {
            LogRequest("\"" + e.Message + "\"", context);
            throw new RpcException(new Status(StatusCode.Internal, e.Message));
        }
    }

    public override Task<DeleteRestaurantResponse> DeleteRestaurant(DeleteRestaurantRequest request, ServerCallContext context)
    {
        LogRequest(request, context);

        try
        {
            RestaurantObject.Delete(request.Id);
            return Task.FromResult(new DeleteRestaurantResponse { Success = true });
        }
        catch
        {
            return Task.FromResult(new DeleteRestaurantResponse { Success = false });

        }
    }
    #endregion

    #region RestaurantGroup

    public override Task<RestaurantGroup> GetRestaurantGroup(GetRestaurantGroupRequest request, ServerCallContext context)
    {
        try
        {

            RestaurantGroupObject? restaurantGroup = RestaurantGroupObject.GetRestaurantGroup(request.Id);
            if (restaurantGroup == null)
                throw new RpcException(new Status(StatusCode.NotFound, "Restaurant group not found"));

            LogRequest(request, context);
            return Task.FromResult(restaurantGroup.ToGrpcRestaurantGroup());
        }
        catch (Exception e)
        {
            LogRequest("\"" + e.Message + "\"", context);
            throw new RpcException(new Status(StatusCode.Internal, e.Message));
        }
    }

    public override Task<RestaurantGroup> CreateRestaurantGroup(CreateRestaurantGroupRequest request, ServerCallContext context)
    {
        try
        {
            RestaurantGroupObject restaurantGroup = RestaurantGroupObject.FromGrpc(request).Save();
            LogRequest(request, context);
            return Task.FromResult(restaurantGroup.ToGrpcRestaurantGroup());
        }
        catch (Exception e)
        {
            LogRequest("\"" + e.Message + "\"", context);
            throw new RpcException(new Status(StatusCode.Internal, e.Message));
        }
    }

    public override Task<RestaurantGroup> UpdateRestaurantGroup(UpdateRestaurantGroupRequest request, ServerCallContext context)
    {
        try
        {
            RestaurantGroupObject? restaurantGroup = RestaurantGroupObject.FromUpdateGrpc(request).Update();
            LogRequest(request, context);
            return Task.FromResult(restaurantGroup.ToGrpcRestaurantGroup());
        }
        catch (Exception e)
        {
            LogRequest("\"" + e.Message + "\"", context);
            throw new RpcException(new Status(StatusCode.Internal, e.Message));
        }
    }

    public override Task<DeleteRestaurantGroupResponse> DeleteRestaurantGroup(DeleteRestaurantGroupRequest request, ServerCallContext context)
    {
        try
        {
            
            RestaurantGroupObject.Delete(request.Id);
            LogRequest(request, context);
            return Task.FromResult(new DeleteRestaurantGroupResponse { Success = true });
        }
        catch (Exception e)
        {
            LogRequest("\"" + e.Message + "\"", context);
            throw new RpcException(new Status(StatusCode.Internal, e.Message));
        }
    }

    #endregion
}
