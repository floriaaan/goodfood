"use client";

import "mapbox-gl/dist/mapbox-gl.css";

import Map, { Marker } from "react-map-gl";
import mapStyle from "@/app/admin/map-style.json";
import { useLocation } from "@/hooks";
import { memo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/ui/data-table";
import { products_columns } from "@/components/admin/tables/product-columns";
import { productList } from "@/constants/data";
import { Button } from "@/components/ui/button";
import { MdAdd } from "react-icons/md";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function AdminHome() {
  const { lat: latitude, lng: longitude } = useLocation();
  return (
    <div className="relative flex h-full w-full flex-col">
      <div className="h-[32rem]">
        <Map
          initialViewState={{
            latitude: latitude || 0,
            longitude: longitude || 0,
            zoom: 12,
          }}
          mapStyle={mapStyle as any}
          styleDiffing
          mapboxAccessToken={MAPBOX_TOKEN}
        >
          <Marker {...{ latitude, longitude }} anchor="bottom"></Marker>
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
                <Button className="w-fit bg-black px-6 text-white" variant="solid">
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

const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`;

const pinStyle = {
  cursor: "pointer",
  fill: "#d00",
  stroke: "none",
};

const UnmemoizedPin = ({ size = 20 }) => {
  return (
    <svg height={size} viewBox="0 0 24 24" style={pinStyle}>
      <path d={ICON} />
    </svg>
  );
};

const Pin = memo(UnmemoizedPin);
