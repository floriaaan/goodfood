"use client";

import { MdAdd } from "react-icons/md";

import { Map, OrderPin, RestaurantPin } from "@/components/map";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { orders_columns } from "@/components/admin/order/columns";
import { products_columns } from "@/components/admin/product/columns";
import { ProductFormSheetContent } from "@/components/admin/product/sheet-content";
import { promotions_columns } from "@/components/admin/promotion/columns";
import { PromotionCreateSheet } from "@/components/admin/promotion/sheet";
import {restaurants_columns} from "@/components/admin/restaurant/columns";
import { RestaurantFormSheetContent } from "@/components/admin/restaurant/sheet-content";
import { users_columns } from "@/components/admin/user/columns";
import { UserCreateSheet } from "@/components/admin/user/sheet";
import { LargeComponentLoader } from "@/components/ui/loader/large-component";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { useAdmin } from "@/hooks/useAdmin";
import { useEffect, useRef, useState } from "react";
import { Marker, Popup } from "react-map-gl";
import {RestaurantCreateSheet, RestaurantRefreshSheet} from "@/components/admin/restaurant/sheet";

export default function AdminHome() {
  const { restaurant, selectRestaurant, restaurant_users, restaurants, products, promotions, orders } = useAdmin();
  const [popup_restaurantId, setPopup_restaurantId] = useState<string | null>(null);

  const mapRef = useRef(null);

  useEffect(() => {
    if (restaurant && mapRef.current) {
      // @ts-ignore - mapRef is not typed
      mapRef.current.flyTo({
        center: [restaurant.address.lng, restaurant.address.lat],
        zoom: 15,
        pitch: 40,
      });
    }
  }, [restaurant]);

  return (
    <>
      {restaurant ? (
        <div className="relative flex h-full w-full flex-col">
          <div className="h-96">
            <Map
              center={{
                latitude: restaurant?.address.lat || 0,
                longitude: restaurant?.address.lng || 0,
              }}
              mapRef={mapRef}
            >
              {orders
                .map((o) => o.delivery.person.location)
                .map((o, i) => (
                  <Marker key={i} latitude={o[0]} longitude={o[1]}>
                    <OrderPin />
                  </Marker>
                ))}
              {restaurants.map((r) => (
                <Marker
                  key={r.id}
                  latitude={r.address.lat}
                  longitude={r.address.lng}
                  anchor="bottom"
                  onClick={(e) => {
                    // If we let the click event propagates to the map, it will immediately close the popup
                    // with `closeOnClick: true`
                    e.originalEvent.stopPropagation();
                    setPopup_restaurantId(r.id);
                  }}
                >
                  <RestaurantPin applyStroke={restaurant == r}/>
                </Marker>
              ))}
              {popup_restaurantId && (
                <>
                  {(() => {
                    const restaurant = restaurants.find((r) => r.id === popup_restaurantId);
                    if (!restaurant) return null;
                    return (
                      <Popup
                        anchor="top"
                        longitude={Number(restaurant.address.lng)}
                        latitude={Number(restaurant.address.lat)}
                        onClose={() => setPopup_restaurantId(null)}
                      >
                        <Button
                          onClick={() => {
                            setPopup_restaurantId(null);
                            selectRestaurant(restaurant.id);
                          }}
                        >
                          {restaurant.name}
                        </Button>
                      </Popup>
                    );
                  })()}
                </>
              )}
            </Map>
          </div>
          <Tabs defaultValue="products" className="w-full">
            <TabsList className="w-full justify-between">
              <TabsTrigger value="restaurants" className="py-4">
                Restaurants
              </TabsTrigger>
              <TabsTrigger value="users" className="py-4">
                Managers du restaurant
              </TabsTrigger>
              <TabsTrigger value="products" className="py-4">
                Produits
              </TabsTrigger>
              <TabsTrigger value="orders" className="py-4">
                Commandes
              </TabsTrigger>
              <TabsTrigger value="promotions" className="py-4">
                Codes promotionnels
              </TabsTrigger>
            </TabsList>
            <div className="p-4">
              <TabsContent value="users">
                <DataTable columns={users_columns} data={restaurant_users} create={<UserCreateSheet />} />
              </TabsContent>
              <TabsContent value="restaurants">
                <DataTable columns={restaurants_columns} data={restaurants} create={<RestaurantCreateSheet />} refresh={<RestaurantRefreshSheet />}/>
              </TabsContent>
              <TabsContent value="products">
                <DataTable
                  columns={products_columns}
                  data={products}
                  create={
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button className="w-fit bg-black px-6 text-white">
                          <MdAdd className="h-4 w-4 shrink-0" />
                          Créer un produit
                        </Button>
                      </SheetTrigger>
                      <ProductFormSheetContent />
                    </Sheet>
                  }
                />
              </TabsContent>
              <TabsContent value="orders">
                <DataTable columns={orders_columns} data={orders} />
              </TabsContent>
              <TabsContent value="promotions">
                <DataTable columns={promotions_columns} data={promotions} create={<PromotionCreateSheet />} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      ) : (
        <LargeComponentLoader className="max-h-screen" />
      )}
    </>
  );
}
