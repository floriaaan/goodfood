import {RestaurantCreateEditFormValues} from "@/components/admin/restaurant/form";
import {Restaurant} from "@/types/restaurant";

export const toRestaurant = (restaurantFormValues: RestaurantCreateEditFormValues) => {
    return {
        id: "",
            name: restaurantFormValues.name,
            address: {
                street: restaurantFormValues.street,
                city: restaurantFormValues.city,
                zipCode: restaurantFormValues.zipcode,
                lat: restaurantFormValues.latitude,
                lng: restaurantFormValues.longitude,
                country: restaurantFormValues.country,
        },
        phone: restaurantFormValues.phone,
        description: restaurantFormValues.description,
        userIds: restaurantFormValues.userIdsList ?? [],
        openingHoursList: [restaurantFormValues.openingHours],
        createdat: new Date().toISOString(),
        updatedat: new Date().toISOString(),
    } as unknown as Restaurant;
}

export const toUpdateRestaurant = (sourceRestaurant: Restaurant, restaurantFormValues: RestaurantCreateEditFormValues) => {
    return {
        id: sourceRestaurant.id,
        name: restaurantFormValues.name ?? sourceRestaurant.name,
        address: {
            street: restaurantFormValues.street ?? sourceRestaurant.address.street,
            city: restaurantFormValues.city ?? sourceRestaurant.address.city,
            zipCode: restaurantFormValues.zipcode ?? sourceRestaurant.address.zipcode,
            lat: restaurantFormValues.latitude ?? sourceRestaurant.address.lat,
            lng: restaurantFormValues.longitude ?? sourceRestaurant.address.lng,
            country: restaurantFormValues.country ?? sourceRestaurant.address.country,
        },
        phone: restaurantFormValues.phone ?? sourceRestaurant.phone,
        description: restaurantFormValues.description ?? sourceRestaurant.description,
        userIds: restaurantFormValues.userIdsList ?? sourceRestaurant.useridsList,
        openingHoursList: [restaurantFormValues.openingHours] ?? sourceRestaurant.openinghoursList,
        createdat: sourceRestaurant.createdat,
        updatedat: new Date().toISOString(),
    } as unknown as Restaurant as Restaurant;
}