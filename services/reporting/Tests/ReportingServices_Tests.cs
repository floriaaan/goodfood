using MetricModel = reporting.Models.Metric;
using MetricGrpc = reporting.Metric;

namespace Tests;

public class ReportingService_Tests
{
    [Fact]
    public void GetKey_Test()
    {
        string RestaurantId = "restaurant_test";
        string Code = "incomes_24h";
        DateTime Date = DateTime.Now;

        MetricModel metric = new MetricModel
        {
            Id = 1,
            Key = RestaurantId + ":" + Date.ToString("yyyy-MM-dd") + ":" + Code,
            RestaurantId = RestaurantId,
            Date = Date,
            Code = Code,
            Value = "test"
        };

        Assert.Equal(metric.Key, metric.GetKey());
        Assert.NotEqual("test", metric.GetKey());

    }

}