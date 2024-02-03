using System.Globalization;
using Com.Goodfood.Order;
using Com.Goodfood.Payment;
using Com.Goodfood.Restaurant;
using Com.Goodfood.Stock;
using CronJobs.Models;
using Google.Protobuf.Collections;
using reporting.Models;
using Google.Protobuf.WellKnownTypes;
using Grpc.Net.Client;
using Microsoft.Extensions.Options;

namespace CronJobs.Services;

public class Daily(IScheduleConfig<Daily> scheduleConfig, ILogger<Daily> logger)
    : CronJobService(scheduleConfig.CronExpression, scheduleConfig.TimeZoneInfo, scheduleConfig.Configuration)
{
    private OrderReportingService.OrderReportingServiceClient _orderReportingServiceClient = null!;
    private OrderService.OrderServiceClient _orderServiceClient = null!;
    private RestaurantService.RestaurantServiceClient _restaurantServiceClient = null!;
    private StockReportingService.StockReportingServiceClient _stockServiceClient = null!;    
    private PaymentService.PaymentServiceClient _paymentServiceClient = null!;

    public override Task StartAsync(CancellationToken cancellationToken)
    {
        var httpHandler = new HttpClientHandler();
        httpHandler.ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator;
        try
        {
            var orderChannel = GrpcChannel.ForAddress(_config.ServiceUrl.OrderUrl, new GrpcChannelOptions { HttpHandler = httpHandler });
            _orderReportingServiceClient = new OrderReportingService.OrderReportingServiceClient(orderChannel);
            _orderServiceClient = new OrderService.OrderServiceClient(orderChannel);
            
            var restaurantChannel = GrpcChannel.ForAddress(_config.ServiceUrl.RestaurantUrl, new GrpcChannelOptions { HttpHandler = httpHandler });
            _restaurantServiceClient = new RestaurantService.RestaurantServiceClient(restaurantChannel);
            
            var stockChannel = GrpcChannel.ForAddress(_config.ServiceUrl.StockUrl, new GrpcChannelOptions { HttpHandler = httpHandler });
            _stockServiceClient = new StockReportingService.StockReportingServiceClient(stockChannel);
            
            var paymentChannel = GrpcChannel.ForAddress(_config.ServiceUrl.PaymentUrl, new GrpcChannelOptions { HttpHandler = httpHandler });
            _paymentServiceClient = new PaymentService.PaymentServiceClient(paymentChannel);
        }catch(Exception e)
        {
            logger.LogError("CronJob daily error: {e}", new{e});
        }
        
        return base.StartAsync(cancellationToken);
    }

    public override Task DoWork(CancellationToken cancellationToken)
    {
        logger.LogInformation("CronJob daily running.");
        try
        {
            var restaurantList = _restaurantServiceClient.GetRestaurants(new Empty(), cancellationToken: cancellationToken);
            logger.LogInformation("Restaurants total: {restaurantList}", new{restaurantList.Restaurants.Count});
            
            foreach (var restaurant in restaurantList.Restaurants)
            {
                logger.LogInformation("Restaurant: {Id}", new{restaurant.Id});
                var reportingRestaurant = RestaurantObject.GetRestaurant(restaurant.Id);
                if (reportingRestaurant == null || string.IsNullOrEmpty(reportingRestaurant.Id))
                {
                    logger.LogError("Restaurant not found: {Id}, {Name}", new { restaurant.Id },
                        new { restaurant.Name });
                    continue;
                }
                reportingRestaurant.Update(restaurant.Name, restaurant.Address.Street);
                
                ProcessIncomes(restaurant.Id, reportingRestaurant, cancellationToken);
                ProcessOutcomes(restaurant.Id, reportingRestaurant, cancellationToken);
                ProcessAffluence(restaurant.Id, reportingRestaurant, cancellationToken);
                ProcessDeliveryTypes(restaurant.Id, reportingRestaurant, cancellationToken);
            }
        }catch(Exception e)
        {
            logger.LogError("CronJob daily error: {e}", new{e});
        }
        return Task.CompletedTask;
    }
    
    private void ProcessIncomes(string restaurantId, RestaurantObject reportingRestaurant, CancellationToken cancellationToken)
    {
        float total = 0;
        var orders = _orderServiceClient.GetOrdersByRestaurant(new GetOrdersByRestaurantRequest { Id = restaurantId }, cancellationToken: cancellationToken);
        foreach (var order in orders.Orders)
        {
            var payment = _paymentServiceClient.GetPayment(new GetPaymentRequest{ Id = order.PaymentId }, cancellationToken: cancellationToken);
            total += payment.Total;
        }
        
        new MetricObject
        {
            Key = Guid.NewGuid().ToString(),
            Code = "incomes_1d",
            Date = DateTime.Now.Date.ToUniversalTime(),
            Value = total.ToString(CultureInfo.InvariantCulture),
            RestaurantId = restaurantId,
            Restaurant = reportingRestaurant
        }.Save();
    }
    private void ProcessOutcomes(string restaurantId, RestaurantObject reportingRestaurant, CancellationToken cancellationToken)
    {
        var reply = _stockServiceClient.GetOutcomesByRestaurant(new GetOutcomesByRestaurantRequest { Date = DateTime.Now.ToString("d"), RestaurantId = restaurantId, Interval = "1d"}, cancellationToken: cancellationToken);
        new MetricObject
        {
            Key = Guid.NewGuid().ToString(),
            Code = "outcomes_1d",
            Date = DateTime.Now.Date.ToUniversalTime(),
            Value = reply?.Value.ToString(CultureInfo.InvariantCulture) ?? "0",
            RestaurantId = restaurantId,
            Restaurant = reportingRestaurant
        }.Save();
    }
    
    private void ProcessAffluence(string restaurantId, RestaurantObject reportingRestaurant, CancellationToken cancellationToken)
    {
        var reply = _orderReportingServiceClient.GetOrdersAffluence(new GetOrdersAffluenceRequest { Date = DateTime.Now.ToString("d"), RestaurantId = restaurantId}, cancellationToken: cancellationToken);
        new MetricObject
        {
            Key = Guid.NewGuid().ToString(),
            Code = "affluence_1d",
            Date = DateTime.Now.Date.ToUniversalTime(),
            Value = string.Join(";", reply?.OrdersPerHour ?? new RepeatedField<int>()),
            RestaurantId = restaurantId,
            Restaurant = reportingRestaurant
        }.Save();
    }
    
    private void ProcessDeliveryTypes(string restaurantId, RestaurantObject reportingRestaurant, CancellationToken cancellationToken)
    {
        var reply = _orderReportingServiceClient.GetDeliveryTypeRepartition(new GetDeliveryTypeRepartitionRequest { Date = DateTime.Now.ToString("d"), RestaurantId = restaurantId, Interval = "1d"}, cancellationToken: cancellationToken);
        new MetricObject
        {
            Key = Guid.NewGuid().ToString(),
            Code = "delivery_types_1d",
            Date = DateTime.Now.Date.ToUniversalTime(),
            Value = reply?.Delivery + ";" + reply?.Takeaway,
            RestaurantId = restaurantId,
            Restaurant = reportingRestaurant
        }.Save();
    }
    
    public override Task StopAsync(CancellationToken cancellationToken)
    {
        logger.LogInformation("CronJob 1 is stopping.");
        return base.StopAsync(cancellationToken);
    }
}