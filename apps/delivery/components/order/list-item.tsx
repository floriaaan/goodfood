import { useNative } from "@/hooks/useNative";
import { calculateDistance } from "@/lib/distance";
import { Order } from "@/types/order";
import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useNavigation } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export const OrderListItem = ({
  item,
  index,
}: {
  item: Order;
  index: number;
}) => {
  const { navigate } = useNavigation() as {
    navigate: (href: string, params?: any) => void;
  };


  const { delivery } = item;
  const {
    address: { lat, lng },
  } = delivery;

  const { location } = useNative();
  const user_location: [number, number] =
    location?.coords.latitude && location?.coords.longitude
      ? [location?.coords.latitude, location?.coords.longitude]
      : [NaN, NaN];

  const restaurant_location: [number, number] =
    item.restaurant?.address?.lat && item.restaurant?.address?.lng
      ? [item.restaurant?.address?.lat, item.restaurant?.address?.lng]
      : [NaN, NaN];


  return (
    <TouchableOpacity onPress={() => navigate("order/[id]", { id: item.id })}>
      <View
        style={{
          backgroundColor: "#111111",
          padding: 8,
          marginTop: 16,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={require("@/assets/images/goodfood.png")}
              style={{ width: 99, height: 24 }}
            />
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontWeight: "700",
              }}
            >
              {item.restaurant?.name}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialIcons name="location-on" size={12} color="white" />
            <Text
              style={{
                color: "white",
                fontSize: 12,
                marginLeft: 4,
              }}
            >
              {restaurant_location.every(isNaN)
                ? "calcul en cours.."
                : calculateDistance([lat, lng], restaurant_location).toFixed(2) +
                  " km"}
            </Text>
          </View>
        </View>
        <Text
          style={{
            width: "100%",
            color: "white",
            textAlign: "center",
            marginBottom: 8,
          }}
        >
          vers
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginVertical: 6,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontWeight: "700",
              }}
            >
              {`${item.delivery.address.street}, ${item.delivery.address.zipcode} ${item.delivery.address.city}`}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialIcons name="location-on" size={12} color="white" />
            <Text
              style={{
                color: "white",
                fontSize: 12,
                marginLeft: 4,
              }}
            >
              {user_location.every(isNaN)
                ? "calcul en cours.."
                : calculateDistance([lat, lng], user_location).toFixed(2) +
                  " km"}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginTop: 8,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <MaterialIcons name="access-time" size={12} color="white" />
            <Text style={{ color: "white", fontSize: 12, marginLeft: 4 }}>
              {`Passée le ${new Date(item.payment.createdAt.toString()).toLocaleString(
                "fr-FR",
                {
                  day: "numeric",
                  month: "short",
                  hour: "numeric",
                  minute: "numeric",
                }
              )} - Estimée pour ${new Date(
                item.delivery.eta.toString()
              ).toLocaleString("fr-FR", {
                hour: "numeric",
                minute: "numeric",
              })}`}
            </Text>
          </View>
          <Image
            source={
              index % 3 === 0
                ? require("@/assets/images/tmp/avatar1.png")
                : index % 3 === 1
                ? require("@/assets/images/tmp/avatar2.png")
                : index % 3 === 2
                ? require("@/assets/images/tmp/avatar3.png")
                : null
            }
            style={{ width: 24, height: 24 }}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};
