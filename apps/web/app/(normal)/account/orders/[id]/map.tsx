"use client";
import { Bow, Map, Marker, OrderPin, RestaurantPin, UserPin } from "@/components/map";
import { LargeComponentLoader } from "@/components/ui/loader/large-component";
import { useLocation } from "@/hooks";
import { DeliveryType, Order } from "@/types/order";

export const OrderStatusMap = (order: Order) => {
  const delivery_person = order.delivery.person;
  const { location: d_location } = delivery_person;
  const [d_lat, d_lng] = d_location;

  const { restaurants } = useLocation();
  const restaurant = restaurants.find((r) => r.id === order.restaurant_id);
  const { address: r_location } = restaurant || {};
  const [r_lat, r_lng] = [r_location?.lat, r_location?.lng] || [0, 0];

  const { address } = order.delivery;
  const [u_lat, u_lng] = [address?.lat, address?.lng] || [0, 0];

  if (!u_lat || !u_lng || !d_lat || !d_lng || !r_lat || !r_lng)
    return (
      <div className="flex aspect-square h-96 w-auto items-center justify-center">
        <LargeComponentLoader className="aspect-auto" />
      </div>
    );

  const [c_lat, c_lng] = [(d_lat + u_lat) / 2, (d_lng + u_lng) / 2];

  return (
    <div className="h-96">
      <Map center={{ latitude: c_lat || 0, longitude: c_lng || 0 }} initialViewState={{ zoom: 10, pitch: 0 }}>
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
