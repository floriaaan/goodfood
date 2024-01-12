"use client";

import { MdAdd } from "react-icons/md";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Map, OrderPin, RestaurantPin } from "@/components/map";

import { products_columns } from "@/components/admin/tables/product";
import { Marker, Popup } from "react-map-gl";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { ProductFormSheetContent } from "@/components/admin/product/sheet-content";
import { useAdmin } from "@/hooks/useAdmin";
import { promotions_columns } from "@/components/admin/tables/promotion";
import { LargeComponentLoader } from "@/components/ui/loader/large-component";
import { restaurants_columns } from "@/components/admin/tables/restaurant";
import { users_columns } from "@/components/admin/tables/user";
import { useState } from "react";

export default function AdminHome() {
  const { restaurant, selectRestaurant, restaurant_users, restaurants, products, promotions, orders } = useAdmin();
  const [popup_restaurantId, setPopup_restaurantId] = useState<string | null>(null);
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
                  <RestaurantPin />
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
              <TabsTrigger value="users" className="py-4">
                Utilisateurs
              </TabsTrigger>
              <TabsTrigger value="restaurants" className="py-4">
                Restaurants
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
                <DataTable
                  columns={users_columns}
                  data={restaurant_users || []}
                  create={
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button className="w-fit bg-black px-6 text-white">
                          <MdAdd className="h-4 w-4 shrink-0" />
                          Ajouter un utilisateur
                        </Button>
                      </SheetTrigger>
                      {/* todo: sheet content */}
                    </Sheet>
                  }
                />
              </TabsContent>
              <TabsContent value="restaurants">
                <DataTable
                  columns={restaurants_columns}
                  data={restaurants}
                  create={
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button className="w-fit bg-black px-6 text-white">
                          <MdAdd className="h-4 w-4 shrink-0" />
                          Créer un restaurant
                        </Button>
                      </SheetTrigger>
                      {/* todo: sheet content */}
                    </Sheet>
                  }
                />
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
              <TabsContent value="orders">Commandes</TabsContent>
              <TabsContent value="promotions">
                <DataTable
                  columns={promotions_columns}
                  data={promotions}
                  create={
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button className="w-fit bg-black px-6 text-white">
                          <MdAdd className="h-4 w-4 shrink-0" />
                          Créer un code promotionnel
                        </Button>
                      </SheetTrigger>
                      {/* todo: sheet content */}
                    </Sheet>
                  }
                />
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
