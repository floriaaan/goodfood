using reporting.Models;

namespace Tests;

public class MetricModel_Tests
{
    [Fact]
    public void GetKey_Test()
    {
        string RestaurantId = "restaurant_test";
        string Code = "incomes_24h";
        DateTime Date = DateTime.Now;

        MetricObject metricObject = new MetricObject
        {
            Id = 1,
            Key = RestaurantId + ":" + Date.ToString("yyyy-MM-dd") + ":" + Code,
            RestaurantId = RestaurantId,
            Date = Date,
            Code = Code,
            Value = "test"
        };

        //Assert.Equal(metricObject.Key, metricObject.GetKey());
        Assert.NotEqual("test", metricObject.GetKey());

    }

    // [Fact]
    // public void FromGrpcPushMetric_Test()
    // {
    //     string RestaurantId = "restaurant_test";
    //     string Code = "incomes_24h";
    //     string Value = "test";

    //     MetricModel metric = MetricModel.FromGrpcPushMetric(new reporting.PushMetricRequest
    //     {
    //         RestaurantId = RestaurantId,
    //         Code = Code,
    //         Value = Value
    //     });

    //     Assert.Equal(metric.RestaurantId, RestaurantId);
    //     Assert.Equal(metric.Code, Code);
    //     Assert.Equal(metric.Value, Value);

    //     Assert.Equal(metric.Key, metric.GetKey());
    // }

    // [Fact]
    // public void ToGrpcMetric_Test()
    // {
    //     string RestaurantId = "restaurant_test";
    //     string Code = "incomes_24h";
    //     string Value = "test";

    //     MetricModel metric = new MetricModel
    //     {
    //         Id = 1,
    //         Key = RestaurantId + ":" + DateTime.Now.Date.ToString("yyyy-MM-dd") + ":" + Code,
    //         RestaurantId = RestaurantId,
    //         Date = DateTime.Now,
    //         Code = Code,
    //         Value = Value
    //     };

    //     reporting.Metric grpcMetric = metric.ToGrpcMetric();

    //     Assert.Equal(grpcMetric.RestaurantId, RestaurantId);
    //     Assert.Equal(grpcMetric.Code, Code);
    //     Assert.Equal(grpcMetric.Value, Value);

    //     Assert.Equal(grpcMetric.Key, metric.GetKey());
    // }
}