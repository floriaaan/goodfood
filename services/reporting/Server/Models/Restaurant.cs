using Microsoft.EntityFrameworkCore;
using System;

namespace reporting.Models

{

    [Index(nameof(Restaurant.Key), IsUnique = true)]
    public class Restaurant
    {
        public string Id { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string Key { get; set; } = null!;
        public string? Address { get; set; }

        public int GroupId { get; set; }
        public string? GroupName { get; set; } = null!;
        public virtual RestaurantGroup Group { get; set; } = null!;

        public reporting.Restaurant ToGrpcRestaurant()
        {
            return new reporting.Restaurant
            {
                Id = this.Id,
                Name = this.Name,
                Key = this.Key,
                Address = this.Address,
                GroupId = this.GroupId,
                GroupName = this.GroupName
            };
        }

        public static Restaurant FromGrpc(CreateRestaurantRequest Request)
        {
            RestaurantGroup? group = RestaurantGroup.GetRestaurantGroup(Request.GroupId);
            if (group == null)
                throw new System.Exception("Group not found");
            
            Restaurant restaurant = new Restaurant
            {
                Id = Request.Key + "_" + Guid.NewGuid().ToString(),
                Name = Request.Name,
                Key = Request.Key,
                Address = Request.Address,
                GroupId = group.Id,
                GroupName = group.Name,
            };

            restaurant.Group = group;

            return restaurant;

        }

        public static Restaurant FromUpdateGrpc(UpdateRestaurantRequest Request)
        {
            Restaurant? restaurant = GetRestaurant(Request.Id);
            if (restaurant == null)
                throw new System.Exception("Restaurant not found");

            RestaurantGroup? group = RestaurantGroup.GetRestaurantGroup(Request.GroupId);
            if (group == null)
                throw new System.Exception("Group not found");

            restaurant.Name = Request.Name;
            restaurant.Key = Request.Key;
            restaurant.Address = Request.Address;
            restaurant.GroupId = group.Id;
            restaurant.GroupName = group.Name;
            restaurant.Group = group;

            return restaurant;
        }

        public static Restaurant? GetRestaurant(string Id)
        {
            using ReportingContext db = new ReportingContext();
            return db.Restaurants.FirstOrDefault(r => r.Id == Id);
        }

        public Restaurant Save()
        {
            

            using ReportingContext db = new ReportingContext();
            
            db.Groups.Attach(this.Group);

            db.Restaurants.Add(this);
            db.SaveChanges();
            return this;
        }

        public Restaurant Update()
        {
            using ReportingContext db = new ReportingContext();

            db.Groups.Attach(this.Group);

            db.Restaurants.Update(this);
            db.SaveChanges();
            return this;
        }

        public static void Delete(string Id)
        {
            using ReportingContext db = new ReportingContext();
            Restaurant? restaurant = db.Restaurants.FirstOrDefault(r => r.Id == Id);
            if (restaurant == null)
                throw new System.Exception("Restaurant not found");
            db.Restaurants.Remove(restaurant);
            db.SaveChanges();
        }

    }

    public class RestaurantGroup
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;

        public virtual ICollection<Restaurant> Restaurants { get; set; }

        public RestaurantGroup()
        {
            this.Restaurants = new HashSet<Restaurant>();
        }


        public static RestaurantGroup FromGrpc(CreateRestaurantGroupRequest Request)
        {
            return new RestaurantGroup
            {
                Name = Request.Name
            };
        }

        public static RestaurantGroup FromUpdateGrpc(UpdateRestaurantGroupRequest Request)
        {
            RestaurantGroup? group = GetRestaurantGroup(Request.Id);
            if (group == null)
                throw new System.Exception("Group not found");

            group.Name = Request.Name;

            return group;
        }

        public reporting.RestaurantGroup ToGrpcRestaurantGroup()
        {
            return new reporting.RestaurantGroup
            {
                Id = this.Id,
                Name = this.Name
            };
        }

        public static RestaurantGroup? GetRestaurantGroup(int Id)
        {
            using ReportingContext db = new ReportingContext();
            return db.Groups.FirstOrDefault(g => g.Id == Id);
        }



        public RestaurantGroup Save()
        {
            using ReportingContext db = new ReportingContext();
            db.Groups.Add(this);
            db.SaveChanges();
            return this;
        }

        public RestaurantGroup Update()
        {
            using ReportingContext db = new ReportingContext();
            db.Groups.Update(this);
            db.SaveChanges();
            return this;
        }

        public static void Delete(int Id)
        {
            using ReportingContext db = new ReportingContext();
            RestaurantGroup? group = db.Groups.FirstOrDefault(g => g.Id == Id);
            if (group == null)
                throw new System.Exception("Group not found");
            db.Groups.Remove(group);
            db.SaveChanges();
        }
    }
}

