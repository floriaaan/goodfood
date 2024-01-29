using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using reporting.Models;

public class ReportingContext : DbContext
{
    public DbSet<MetricObject> Metrics { get; set; }
    public DbSet<RestaurantObject> Restaurants { get; set; }
    public DbSet<RestaurantGroupObject> Groups { get; set; }
    
    private readonly IOptions<Config> _config;

    public ReportingContext(IOptions<Config> config)
    {
        _config = config;
        
        Metrics = Set<MetricObject>();
        Restaurants = Set<RestaurantObject>();
        Groups = Set<RestaurantGroupObject>();
    }

    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        // TODO: Move to config
        options.UseNpgsql("Host=localhost;Port=5432;Database=postgres;Username=postgres;Password=password");
    }
}