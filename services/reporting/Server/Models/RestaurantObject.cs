using Com.Goodfood.Reporting;
using Restaurant = Com.Goodfood.Restaurant.Restaurant;
using RestaurantMetric = Com.Goodfood.Reporting.Restaurant;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace reporting.Models
{
    [Index(nameof(Key), IsUnique = true)]
    public class RestaurantObject
    {
        public string Id { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string Key { get; set; } = null!;
        public string? Address { get; set; } = null!;

        public int? GroupId { get; set; } = null!;
        public string? GroupName { get; set; } = null!;
        public virtual RestaurantGroupObject Group { get; set; } = null!;

        public static IOptions<Config> _config { get; set; }
        
        public Restaurant ToGrpcRestaurant()
        {
            return new Restaurant
            {
                Id = this.Id,
                Name = this.Name,
                Address = this.Address,
            };
        }

        public RestaurantMetric ToGrpcRestaurantMetric()
        {
            return new RestaurantMetric
            {
                Id = this.Id,
                Name = this.Name,
                Address = this.Address,
            };
        }
        public void FromRestaurantService(Restaurant restaurant)
        {
            this.Name = restaurant.Name;
            this.Address = restaurant.Address;
        } 
        
        public static RestaurantObject FromGrpc(CreateRestaurantRequest request)
        {
            RestaurantGroupObject? group = RestaurantGroupObject.GetRestaurantGroup(request.GroupId);
            if (group == null)
                throw new Exception("Group not found");
            
            RestaurantObject restaurantObject = new RestaurantObject
            {
                Id = String.IsNullOrEmpty(request.Id) ? Guid.NewGuid().ToString() : request.Id,
                Name = request.Name,
                Key = request.Key,
                Address = request.Address,
                GroupId = group.Id,
                GroupName = group.Name,
            };

            restaurantObject.Group = group;

            return restaurantObject;

        }

        public static RestaurantObject FromGrpc(RestaurantMetric grpcRestaurantMetric)
        {
            RestaurantGroupObject? group = RestaurantGroupObject.GetRestaurantGroup(grpcRestaurantMetric.GroupId);
            
            RestaurantObject restaurantObject = new RestaurantObject
            {
                Id = grpcRestaurantMetric.Key + "_" + Guid.NewGuid(),
                Name = grpcRestaurantMetric.Name,
                Key = grpcRestaurantMetric.Key,
                Address = grpcRestaurantMetric.Address,
                GroupId = grpcRestaurantMetric.GroupId,
                GroupName = group?.Name,
                Group = group
            };

            return restaurantObject;
        }
        
        public static RestaurantObject FromUpdateGrpc(UpdateRestaurantRequest request)
        {
            RestaurantObject? restaurant = GetRestaurant(request.Id);
            if (restaurant == null)
                throw new System.Exception("Restaurant not found");

            RestaurantGroupObject? group = RestaurantGroupObject.GetRestaurantGroup(request.GroupId);
            if (group == null)
                throw new System.Exception("Group not found");

            restaurant.Name = request.Name;
            restaurant.Key = request.Key;
            restaurant.Address = request.Address;
            restaurant.GroupId = group.Id;
            restaurant.GroupName = group.Name;
            restaurant.Group = group;

            return restaurant;
        }

        public static RestaurantObject? GetRestaurant(string id)
        {
            using ReportingContext db = new ReportingContext(_config);
            RestaurantObject? restaurantObject = db.Restaurants.FirstOrDefault(r => r.Id == id);
            if(restaurantObject == null)
                return null;
            
            RestaurantGroupObject? group = RestaurantGroupObject.GetRestaurantGroup(restaurantObject?.GroupId ?? -1);
            if (group == null)
                throw new System.Exception("Group not found");
            
            restaurantObject!.Group = group;
            return restaurantObject;
        }

        public RestaurantObject Save()
        {
            using ReportingContext db = new ReportingContext(_config);
            
            db.Groups.Attach(this.Group);

            db.Restaurants.Add(this);
            db.SaveChanges();
            return this;
        }

        public RestaurantObject Update()
        {
            using ReportingContext db = new ReportingContext(_config);

            db.Groups.Attach(this.Group);

            db.Restaurants.Update(this);
            db.SaveChanges();
            return this;
        }

        public RestaurantObject Update(string name, string address)
        {
            using ReportingContext db = new ReportingContext(_config);

            this.Name = name;
            this.Address = address;

            db.Groups.Attach(this.Group);
            
            db.Restaurants.Update(this);
            db.SaveChanges();
            return this;
        }
        
        public static void Delete(string id)
        {
            using ReportingContext db = new ReportingContext(_config);
            RestaurantObject? restaurant = db.Restaurants.FirstOrDefault(r => r.Id == id);
            if (restaurant == null)
                throw new System.Exception("Restaurant not found");
            db.Restaurants.Remove(restaurant);
            db.SaveChanges();
        }

    }

    public class RestaurantGroupObject
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        
        public static IOptions<Config> _config { get; set; }

        public virtual ICollection<RestaurantObject> Restaurants { get; set; }

        public RestaurantGroupObject()
        {
            this.Restaurants = new HashSet<RestaurantObject>();
        }


        public static RestaurantGroupObject FromGrpc(CreateRestaurantGroupRequest Request)
        {
            return new RestaurantGroupObject
            {
                Name = Request.Name
            };
        }

        public static RestaurantGroupObject FromUpdateGrpc(UpdateRestaurantGroupRequest Request)
        {
            RestaurantGroupObject? group = GetRestaurantGroup(Request.Id);
            if (group == null)
                throw new System.Exception("Group not found");

            group.Name = Request.Name;

            return group;
        }

        public RestaurantGroup ToGrpcRestaurantGroup()
        {
            return new RestaurantGroup
            {
                Id = this.Id,
                Name = this.Name
            };
        }

        public static RestaurantGroupObject? GetRestaurantGroup(int Id)
        {
            using ReportingContext db = new ReportingContext(_config);
            return db.Groups.FirstOrDefault(g => g.Id == Id);
        }



        public RestaurantGroupObject Save()
        {
            using ReportingContext db = new ReportingContext(_config);
            db.Groups.Add(this);
            db.SaveChanges();
            return this;
        }

        public RestaurantGroupObject Update()
        {
            using ReportingContext db = new ReportingContext(_config);
            db.Groups.Update(this);
            db.SaveChanges();
            return this;
        }

        public static void Delete(int Id)
        {
            using ReportingContext db = new ReportingContext(_config);
            RestaurantGroupObject? group = db.Groups.FirstOrDefault(g => g.Id == Id);
            if (group == null)
                throw new System.Exception("Group not found");
            db.Groups.Remove(group);
            db.SaveChanges();
        }
    }
}

