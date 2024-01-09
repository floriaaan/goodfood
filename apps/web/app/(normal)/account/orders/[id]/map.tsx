"use client";
import { Order } from "@/types/order";
import { useEffect, useState } from "react";
import { Map, OrderPin, Marker, UserPin, RestaurantPin, Bow } from "@/components/map";
import { searchAddress } from "@/lib/fetchers/externals/api-gouv";
import { DeliveryType } from "@/types/order";
import { LargeComponentLoader } from "@/components/ui/loader/large-component";
import { useLocation } from "@/hooks";

export const OrderStatusMap = (order: Order) => {
  const delivery_person = order.delivery.person;
  const { location: d_location } = delivery_person;
  const [d_lat, d_lng] = d_location;

  const { restaurants } = useLocation();
  const restaurant = restaurants.find((r) => r.id === order.restaurant_id);
  const { locationList: r_location } = restaurant || {};
  const [r_lat, r_lng] = r_location || [0, 0];

  // todo: move getting gps coordinates of address to service instead of client
  const { address } = order.delivery;
  const [[u_lat, u_lng], setUserLatLng] = useState([0, 0]);

  useEffect(() => {
    (async () => {
      const { features } = await searchAddress(address);
      setUserLatLng([features[0].geometry.coordinates[1], features[0].geometry.coordinates[0]]);
    })();
  }, [address]);

  if (!u_lat || !u_lng || !d_lat || !d_lng || !r_lat || !r_lng)
    return (
      <div className="flex aspect-square h-96 w-auto items-center justify-center">
        <LargeComponentLoader className="aspect-auto" />
      </div>
    );

  const [c_lat, c_lng] = [(d_lat + u_lat) / 2, (d_lng + u_lng) / 2];

  return (
    <div className="h-96">
      <Map
        center={{ latitude: c_lat || 0, longitude: c_lng || 0 }}
        initialViewState={{
          zoom: 10,
          pitch: 0,
        }}
        // viewState={{
        //   bearing: 0,
        //   width: 0,
        //   height: 0,
        //   pitch: 0,
        //   padding: {
        //     bottom: 0,
        //     left: 0,
        //     right: 0,
        //     top: 0,
        //   },

        //   latitude: c_lat || 0,
        //   longitude: c_lng || 0,
        //   zoom: 10,
        // }}
      >
        <Marker anchor="center" latitude={u_lat} longitude={u_lng}>
          <UserPin />
        </Marker>

        {order.delivery_type === DeliveryType.DELIVERY && (
          <Marker latitude={d_lat} longitude={d_lng} anchor="center">
            <OrderPin />
          </Marker>
        )}
        {order.delivery_type === DeliveryType.TAKEAWAY && (
          <Marker latitude={r_lat} longitude={r_lng} anchor="bottom">
            <RestaurantPin />
          </Marker>
        )}
        <Bow markerA={{ latitude: u_lat, longitude: u_lng }} markerB={{ latitude: d_lat, longitude: d_lng }} />
      </Map>
    </div>
  );
};
