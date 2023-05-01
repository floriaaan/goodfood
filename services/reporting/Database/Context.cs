using Microsoft.EntityFrameworkCore;
using reporting.Models;

public class ReportingContext : DbContext
{
    public DbSet<Metric> Metrics { get; set; }

    public ReportingContext()
    {
        Metrics = Set<Metric>();
    }


    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        // TODO: Move to config
        options.UseNpgsql("Host=localhost;Database=postgres;Username=postgres;Password=password");
    }
}