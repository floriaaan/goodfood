using Microsoft.EntityFrameworkCore;
using reporting.Models;

public class ReportingContext : DbContext
{
    public DbSet<Metric> Metrics { get; set; }
    public DbSet<Restaurant> Restaurants { get; set; }
    public DbSet<RestaurantGroup> Groups { get; set; }

    public ReportingContext()
    {
        Metrics = Set<Metric>();
        Restaurants = Set<Restaurant>();
        Groups = Set<RestaurantGroup>();

    }


    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        // TODO: Move to config
        options.UseNpgsql("Host=localhost;Database=postgres;Username=postgres;Password=password");
    }
}