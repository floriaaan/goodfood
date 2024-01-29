using reporting.Models;

namespace Tests;

public class ReportingService_Tests
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

        Assert.Equal(metricObject.Key, metricObject.GetKey());
        Assert.NotEqual("test", metricObject.GetKey());

    }

}