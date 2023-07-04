using Microsoft.EntityFrameworkCore;
using LCode = reporting.Libraries.Code;

namespace reporting.Models
{

    [Index(nameof(Metric.Key), IsUnique = true)]
    public class Metric
    {
        public int Id { get; set; }

        // Key is a combination of RestaurantId, Date and Code (RestaurantId:Date:Code) and isUnique
        public string Key { get; set; } = null!;
        // RestaurantId is a foreign key to Restaurant.Key
        public DateTime Date { get; set; }
        public string Code { get; set; } = null!;
        public string Value { get; set; } = null!;
        public string RestaurantId { get; set; } = null!;
        public Restaurant Restaurant { get; set; } = null!;


        public static Metric FromGrpcPushMetric(PushMetricRequest Request)
        {
            if(!LCode.IsValid(Request.Code))
                throw new System.Exception($"Invalid code provided, received: {Request.Code}, expected: {LCode.ValidCodesString}");

            Restaurant? restaurant = Restaurant.GetRestaurant(Request.RestaurantId);
            if (restaurant == null)
                throw new System.Exception("Restaurant not found");


            return new Metric
            {
                Key = Request.RestaurantId + ":" + DateTime.Now.Date.ToString("yyyy-MM-dd") + ":" + Request.Code,
                RestaurantId = Request.RestaurantId,
                Restaurant = restaurant,
                Date = Google.Protobuf.WellKnownTypes.Timestamp.FromDateTime(DateTime.UtcNow).ToDateTime(),
                Code = Request.Code,
                Value = Request.Value
            };
        }

        public reporting.Metric ToGrpcMetric()
        {
            Restaurant? restaurant = Restaurant.GetRestaurant(this.RestaurantId);
            if (restaurant == null)
                throw new System.Exception("Restaurant not found");

            return new reporting.Metric
            {
                Id = this.Id,
                Key = this.Key,
                RestaurantId = this.RestaurantId,
                Date = Google.Protobuf.WellKnownTypes.Timestamp.FromDateTime(this.Date.ToUniversalTime()),
                Code = this.Code,
                Value = this.Value,
                Restaurant = restaurant.ToGrpcRestaurant()
            };
        }

        // getters and setters for the database
        public static Metric? GetMetricByKey(string Key)
        {
            using ReportingContext db = new ReportingContext();
            return db.Metrics.FirstOrDefault(m => m.Key == Key);
        }

        public static List<Metric> GetMetricsByRestaurant(string Key)
        {
            using ReportingContext db = new ReportingContext();
            return db.Metrics.Where(m => m.RestaurantId == Key).ToList();
        }

        public static List<Metric> GetMetricsByRestaurantAndDate(string Key, string Date)
        {
            List<Metric> metrics = GetMetricsByRestaurant(Key);
            return metrics.Where(m => m.Date.ToString("yyyy-MM-dd") == Date).ToList();
        }

        public static List<Metric> GetMetricsByRestaurantGroup(int GroupId)
        {
            using ReportingContext db = new ReportingContext();
            return db.Metrics.Where(m => m.Restaurant.GroupId == GroupId).ToList();
        }

        public Metric Save()
        {
            using ReportingContext db = new ReportingContext();
            // if already exists, upsert
            if (db.Metrics.Any(m => m.Key == this.Key))
            {
                Metric metric = db.Metrics.First(m => m.Key == this.Key);
                metric.Value = this.Value;

                db.Metrics.Update(metric);
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
}

