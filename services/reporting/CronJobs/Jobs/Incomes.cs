using MetricModel = reporting.Models.Metric;

namespace reporting.CronJobs.Jobs;

public class Incomes
{

    public static void _1d()
    {
        // todo: get data from other services

        MetricModel metric = MetricModel.FromGrpcPushMetric(new PushMetricRequest() {
            Code = "incomes_1d",
            Value = "1000",
            RestaurantId = "example_key:1b226471-0583-47e1-b07a-2b863b13ecc5"
        }).Save();
    }

    public static void _1w()
    {

    }

    public static void _1m()
    {

    }

    public static void _1y()
    {

    }
}
