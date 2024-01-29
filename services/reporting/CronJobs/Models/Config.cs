namespace CronJobs.Models;

public class Config
{
    public ServiceUrl ServiceUrl { get; set; }
}

public class ServiceUrl
{
    public string OrderUrl { get; set; }
    public string RestaurantUrl { get; set; }
    public string StockUrl { get; set; }
    public string PaymentUrl { get; set; }
}