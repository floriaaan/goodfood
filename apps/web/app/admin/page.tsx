"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import { MdAdd } from "react-icons/md";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Map, OrderPin, RestaurantPin } from "@/components/map";

import { products_columns } from "@/components/admin/tables/product-columns";
import { productList, restaurantList } from "@/constants/data";
import { Marker } from "react-map-gl";

export default function AdminHome() {
  return (
    <div className="relative flex h-full w-full flex-col">
      <div className="h-[32rem]">
        <Map
          center={{
            latitude: restaurantList[0].locationList[0] || 0,
            longitude: restaurantList[0].locationList[1] || 0,
          }}
        >
          {[
            [49.441459, 1.094856],
            [49.440859, 1.09486],
          ].map((o, i) => (
            <Marker key={i} latitude={o[0]} longitude={o[1]}>
              <OrderPin />
            </Marker>
          ))}
          {restaurantList.map((r) => (
            <Marker key={r.id} latitude={r.locationList[0]} longitude={r.locationList[1]}>
              <RestaurantPin />
            </Marker>
          ))}
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
          <TabsContent value="users">Utilisateurs</TabsContent>
          <TabsContent value="restaurants">Restaurants</TabsContent>
          <TabsContent value="products">
            <DataTable
              columns={products_columns}
              data={productList}
              create={
                <Button className="w-fit bg-black px-6 text-white">
                  <MdAdd className="h-4 w-4 shrink-0" />
                  Créer un produit
                </Button>
              }
            />
          </TabsContent>
          <TabsContent value="orders">Commandes</TabsContent>
          <TabsContent value="promotions">Codes promotionnels</TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
