using Microsoft.EntityFrameworkCore;

namespace reporting.Models
{

    // TODO: upsert on push, instead of throwing exception
    [Index(nameof(Metric.Key), IsUnique = true)]
    public class Metric
    {
        public int Id { get; set; }

        // Key is a combination of RestaurantId, Date and Code (RestaurantId:Date:Code) and isUnique
        public string Key { get; set; } = null!;
        public string RestaurantId { get; set; } = null!;
        public DateTime Date { get; set; }
        public string Code { get; set; } = null!;
        public string Value { get; set; } = null!;

    }
}

