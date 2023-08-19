import { MaterialCommunityIcons } from "@expo/vector-icons";
import classNames from "classnames";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Text, TouchableOpacity, View } from "react-native";

import { Status } from "@/types";
import { Order } from "@/types/order";

const ORDER_STATUS = {
  [Status.PENDING]: "En attente",
  [Status.FULFILLED]: "Livrée",
  [Status.REJECTED]: "Annulée",
  [Status.IN_PROGRESS]: "En cours",
};

export const OrderListItem = ({ item, navigate }: { item: Order; navigate: (href: string, params?: any) => void }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        navigate(`(app)`, {
          screen: "orders/[id]/index",
          params: { id: item.id },
        });
      }}
      key={item.id}
      className={classNames(
        "relative flex flex-col w-full py-4 bg-white gap-y-2",
        item.status === Status.FULFILLED && "opacity-50",
      )}
    >
      {item.status !== Status.REJECTED && item.status !== Status.FULFILLED && (
        <Text className="font-bold text-base">{`Livraison estimée : ${format(
          new Date(item.delivery.eta),
          "dd MMMM yyyy à HH:mm",
          {
            locale: fr,
          },
        )}`}</Text>
      )}
      {item.status === Status.REJECTED && <Text className="font-bold">Commande annulée</Text>}
      {item.status === Status.FULFILLED && (
        <Text className="font-bold">{`Livrée le ${format(new Date(item.updated_at), "dd MMMM yyyy à HH:mm", {
          locale: fr,
        })}`}</Text>
      )}
      <View className="flex flex-row space-x-2 justify-between">
        <View className="flex flex-col grow gap-1">
          <View className="flex flex-row items-center">
            <MaterialCommunityIcons name="truck-delivery" size={16} color="black" />
            <Text className="ml-2 text-sm font-medium text-black">{ORDER_STATUS[item.status]}</Text>
          </View>
          <View className="flex flex-row items-center">
            <MaterialCommunityIcons name="calendar" size={16} color="black" />
            <Text className="ml-2 text-sm font-medium text-black">
              {format(new Date(item.created_at), "dd MMMM yyyy à HH:mm", {
                locale: fr,
              })}
            </Text>
          </View>
        </View>
        <View className="flex flex-col gap-1">
          <View className="flex flex-row items-center justify-end">
            <Text className="ml-2 text-sm font-extrabold text-black">{item.payment.total.toFixed(2)} €</Text>
          </View>
          <View className="flex flex-row items-center">
            <MaterialCommunityIcons name="walk" size={16} color="black" />
            <Text className="ml-2 text-sm font-medium text-black">
              {item.delivery.person.first_name + " " + item.delivery.person.last_name}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
