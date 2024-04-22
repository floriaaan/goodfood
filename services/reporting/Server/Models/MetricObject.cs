using Com.Goodfood.Reporting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using reporting.Libraries;

namespace reporting.Models
{
    [Index(nameof(MetricObject.Key), IsUnique = true)]
    public class MetricObject
    {
        public int Id { get; set; }

        // Key is a combination of RestaurantId, Date and Code (RestaurantId:Date:Code) and isUnique
        public string Key { get; set; } = null!;
        // RestaurantId is a foreign key to Restaurant.Key
        public DateTime Date { get; set; }
        public string Code { get; set; } = null!;
        public string Value { get; set; } = null!;
        public string RestaurantId { get; set; } = null!;
        public RestaurantObject Restaurant { get; set; } = null!;
        public static IOptions<Config> _config { get; set; }

        public static MetricObject FromGrpcPushMetric(PushMetricRequest Request)
        {
            if(!CodeVerification.IsValid(Request.Code))
                throw new System.Exception($"Invalid code provided, received: {Request.Code}, expected: {CodeVerification.ValidCodesString}");

            RestaurantObject? restaurant = RestaurantObject.GetRestaurant(Request.RestaurantId);
            if (restaurant == null)
                throw new System.Exception("Restaurant not found");


            return new MetricObject
            {
                Key = Request.RestaurantId + ":" + DateTime.Now.Date.ToString("yyyy-MM-dd") + ":" + Request.Code,
                RestaurantId = Request.RestaurantId,
                Restaurant = restaurant,
                Date = Google.Protobuf.WellKnownTypes.Timestamp.FromDateTime(DateTime.UtcNow).ToDateTime(),
                Code = Request.Code,
                Value = Request.Value
            };
        }

        public Metric ToGrpcMetric()
        {
            RestaurantObject? restaurant = RestaurantObject.GetRestaurant(this.RestaurantId);
            if (restaurant == null)
                throw new System.Exception("Restaurant not found");

            return new Metric
            {
                Id = this.Id,
                Key = this.Key,
                RestaurantId = this.RestaurantId,
                Date = Google.Protobuf.WellKnownTypes.Timestamp.FromDateTime(this.Date.ToUniversalTime()),
                Code = this.Code,
                Value = this.Value,
                Restaurant = restaurant.ToGrpcRestaurantMetric()
            };
        }

        // getters and setters for the database
        public static MetricObject? GetMetricByKey(string Key)
        {
            using ReportingContext db = new ReportingContext(_config);
            return db.Metrics.FirstOrDefault(m => m.Key == Key);
        }

        public static List<MetricObject> GetMetricsByRestaurant(string Key)
        {
            using ReportingContext db = new ReportingContext(_config);
            return db.Metrics.Where(m => m.RestaurantId == Key).ToList();
        }

        public static List<MetricObject> GetMetricsByRestaurantAndDate(string Key, string Date)
        {
            List<MetricObject> metrics = GetMetricsByRestaurant(Key);
            return metrics.Where(m => m.Date.ToString("yyyy-MM-dd") == Date).ToList();
        }

        public static List<MetricObject> GetMetricsByRestaurantGroup(int GroupId)
        {
            using ReportingContext db = new ReportingContext(_config);
            return db.Metrics.Where(m => m.Restaurant.GroupId == GroupId).ToList();
        }

        public MetricObject Save()
        {
            using ReportingContext db = new ReportingContext(_config);
            // if already exists, upsert
            if (db.Metrics.Find(this.Id) != null)
            {
                MetricObject metricObject = db.Metrics.First(m => m.Key == this.Key);
                metricObject.Value = this.Value;

                db.Metrics.Update(metricObject);
                db.SaveChanges();
                return this;
            }

            // attach restaurant
            db.Restaurants.Attach(this.Restaurant);

            db.Metrics.Add(this);
            db.SaveChanges();
            return this;
        }


        // getters and setters for the model
        public string GetKey()
        {
            return this.RestaurantId + ":" + this.Date.ToString("yyyy-MM-dd") + ":" + this.Code;
        }
    }
    
    public class MetricRequest
    {
        public string RestaurantId { get; set; } = null!;
        public string Code { get; set; } = null!;
        public string Value { get; set; } = null!;
        
        public MetricObject ToMetric()
        {
            RestaurantObject? restaurant = RestaurantObject.GetRestaurant(this.RestaurantId);
            if (restaurant == null)
                throw new System.Exception("Restaurant not found");
            
            return new MetricObject
            {
                RestaurantId = this.RestaurantId,
                Restaurant = restaurant,
                Key = this.RestaurantId + ":" + DateTime.Now.ToString("yyyy-MM-dd") + ":" + this.Code,
                Date = Google.Protobuf.WellKnownTypes.Timestamp.FromDateTime(DateTime.UtcNow).ToDateTime(),
                Code = this.Code,
                Value = this.Value
            };
        }
    }
}

