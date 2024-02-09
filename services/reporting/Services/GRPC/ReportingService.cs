using Grpc.Core;
using MetricModel = reporting.Models.Metric;
using RestaurantModel = reporting.Models.Restaurant;
using RestaurantGroupModel = reporting.Models.RestaurantGroup;
using MetricGrpc = reporting.Metric;
using ReportingServiceAMQP = reporting.Services.RabbitMQ.ReportingService;
using System;


namespace reporting.Services.GRPC;


public class ReportingService : reporting.ReportingService.ReportingServiceBase
{
    private readonly ILogger<ReportingService> _logger;
    private readonly ReportingContext _db;
    private readonly ReportingServiceAMQP _amqp;
    public ReportingService(ILogger<ReportingService> logger)
    {
        _logger = logger;
        _db = new ReportingContext();
        _amqp = new ReportingServiceAMQP(logger);
    }

    private void LogRequest<T>(T Request, ServerCallContext Context)
    {
        string Date = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
        string Method = Context.Method.Split('.').Last();
        string RequestBody = Request?.ToString() ?? "null";

        _logger.LogInformation("\x1b[35m{Date}\x1b[0m | \x1b[36mGRPC\x1b[0m | \x1b[33m{Message}\x1b[0m\n", Date, Method + " with: " + RequestBody);
        _amqp.LogRequest(Method, Request);
    }

    #region Metric
    public override Task<MetricGrpc> GetMetric(GetMetricRequest request, ServerCallContext context)
    {

        try
        {
            MetricModel? metric = MetricModel.GetMetricByKey(request.Key);
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

            List<MetricModel> metrics = MetricModel.GetMetricsByRestaurant(request.RestaurantId);
            List<MetricGrpc> response = metrics.Select(m => m.ToGrpcMetric()).ToList();

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
            List<MetricModel> metrics = MetricModel.GetMetricsByRestaurantAndDate(request.RestaurantId, request.Date);
            List<MetricGrpc> response = metrics.Select(m => m.ToGrpcMetric()).ToList();

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
            List<MetricModel> metrics = MetricModel.GetMetricsByRestaurantGroup(request.RestaurantGroupId);
            List<MetricGrpc> response = metrics.Select(m => m.ToGrpcMetric()).ToList();

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
            MetricModel metric = MetricModel.FromGrpcPushMetric(request).Save();

            LogRequest(request, context);
            return Task.FromResult(new PushMetricResponse { Key = metric.Key });
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
            RestaurantModel? restaurant = RestaurantModel.GetRestaurant(request.Id);
            if (restaurant == null)
                throw new RpcException(new Status(StatusCode.NotFound, "Restaurant not found"));

            LogRequest(request, context);
            return Task.FromResult(restaurant.ToGrpcRestaurant());
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
            RestaurantModel restaurant = RestaurantModel.FromGrpc(request).Save();
            LogRequest(request, context);
            return Task.FromResult(restaurant.ToGrpcRestaurant());
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
            RestaurantModel? restaurant = RestaurantModel.FromUpdateGrpc(request).Update();
            return Task.FromResult(restaurant.ToGrpcRestaurant());
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
            RestaurantModel.Delete(request.Id);
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

            RestaurantGroupModel? restaurantGroup = RestaurantGroupModel.GetRestaurantGroup(request.Id);
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
            RestaurantGroupModel restaurantGroup = RestaurantGroupModel.FromGrpc(request).Save();
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
            RestaurantGroupModel? restaurantGroup = RestaurantGroupModel.FromUpdateGrpc(request).Update();
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
            RestaurantGroupModel.Delete(request.Id);
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
