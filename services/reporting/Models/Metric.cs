using Microsoft.EntityFrameworkCore;

namespace reporting.Models
{

    // TODO: upsert on push, instead of throwing exception
    [Index(nameof(Metric.Key), IsUnique = true)]
    // TODO: add foreign on RestaurantId to Restaurant.Key
    public class Metric
    {
        public int Id { get; set; }

        // Key is a combination of RestaurantId, Date and Code (RestaurantId:Date:Code) and isUnique
        public string Key { get; set; } = null!;
        // RestaurantId is a foreign key to Restaurant.Key
        public string RestaurantId { get; set; } = null!;
        public DateTime Date { get; set; }
        public string Code { get; set; } = null!;
        public string Value { get; set; } = null!;

        public static Metric FromGrpcPushMetric(PushMetricRequest request)
        {
            return new Metric
            {
                Key = request.RestaurantId + ":" + DateTime.Now.Date.ToString("yyyy-MM-dd") + ":" + request.Code,
                RestaurantId = request.RestaurantId,
                Date = Google.Protobuf.WellKnownTypes.Timestamp.FromDateTime(DateTime.UtcNow).ToDateTime(),
                Code = request.Code,
                Value = request.Value
            };
        }

        public reporting.Metric ToGrpcMetric()
        {
            return new reporting.Metric
            {
                Id = this.Id.ToString(),
                Key = this.Key,
                RestaurantId = this.RestaurantId,
                Date = Google.Protobuf.WellKnownTypes.Timestamp.FromDateTime(this.Date.ToUniversalTime()),
                Code = this.Code,
                Value = this.Value
            };
        }

        // getters and setters for the database
        public static Metric? GetMetricByKey(string key)
        {
            using ReportingContext db = new ReportingContext();
            return db.Metrics.FirstOrDefault(m => m.Key == key);
        }

        public static List<Metric> GetMetricsByRestaurant(string key)
        {
            using ReportingContext db = new ReportingContext();
            return db.Metrics.Where(m => m.RestaurantId == key).ToList();
        }

        public static List<Metric> GetMetricsByRestaurantAndDate(string key, string date)
        {
            List<Metric> metrics = GetMetricsByRestaurant(key);
            return metrics.Where(m => m.Date.ToString("yyyy-MM-dd") == date).ToList();
        }

        public Metric SaveMetric()
        {
            using ReportingContext db = new ReportingContext();
            // if already exists, upsert
            if(db.Metrics.Any(m => m.Key == this.Key))
            {
                Metric metric = db.Metrics.First(m => m.Key == this.Key);
                metric.Value = this.Value;

                db.Metrics.Update(metric);
                db.SaveChanges();
                return this;
            }

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

