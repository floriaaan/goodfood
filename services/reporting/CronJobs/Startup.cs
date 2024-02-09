using CronJobs.Models;
using CronJobs.Services;

namespace CronJobs
{
    public class Startup
    {
        public IConfigurationRoot Config { get; set; }
        
        public Startup()
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
                .AddJsonFile("appsettings-cronjobs.json", optional: true, reloadOnChange: true);
            Config = builder.Build();
        }
        
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            
            services.AddCronJob<Daily>(c =>
            {
                c.TimeZoneInfo = TimeZoneInfo.Local;
                c.CronExpression = "*/5 * * * *";
                c.Configuration = Config.GetSection("Config").Get<Config>() ?? new Config();
            });
            // MyCronJob2 calls the scoped service MyScopedService
            /*services.AddCronJob<MyCronJob2>(c =>
            {
                c.TimeZoneInfo = TimeZoneInfo.Local;
                c.CronExpression = "* * * * *";
            });

            services.AddCronJob<MyCronJob3>(c =>
            {
                c.TimeZoneInfo = TimeZoneInfo.Local;
                c.CronExpression = "50 12 * * *";
            });*/
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}