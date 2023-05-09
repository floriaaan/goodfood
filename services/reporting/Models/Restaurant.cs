using Microsoft.EntityFrameworkCore;

namespace reporting.Models

{

    [Index(nameof(Restaurant.Key), IsUnique = true)]
    public class Restaurant
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Key { get; set; } = null!;


    }
}

