import { MaterialCommunityIcons } from "@expo/vector-icons";
import classNames from "classnames";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Text, TouchableOpacity, View } from "react-native";

import { toPrice } from "@/lib/product/toPrice";
import { toName } from "@/lib/user";
import { Status } from "@/types/global";
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
        "relative flex flex-col w-full py-2 px-2 bg-neutral-100 gap-y-2",
        item.status === Status.FULFILLED && "opacity-50",
      )}
    >
      {item.status !== Status.REJECTED && item.status !== Status.FULFILLED && item.delivery.eta && (
        <Text className="text-base font-bold">{`Livraison estimée : ${format(
          new Date(item.delivery.eta),
          "dd MMMM yyyy à HH:mm",
          {
            locale: fr,
          },
        )}`}</Text>
      )}
      {item.status === Status.REJECTED && <Text className="font-bold">Commande annulée</Text>}
      {item.status === Status.FULFILLED && (
        <Text className="font-bold">{`Livrée le ${format(new Date(item.updatedAt), "dd MMMM yyyy à HH:mm", {
          locale: fr,
        })}`}</Text>
      )}
      <View className="flex flex-row justify-between space-x-2">
        <View className="flex flex-col gap-1 grow">
          <View className="flex flex-row items-center">
            <MaterialCommunityIcons name="truck-delivery" size={16} color="black" />
            <Text className="ml-2 text-sm font-medium text-black">{ORDER_STATUS[item.status]}</Text>
          </View>
          <View className="flex flex-row items-center">
            <MaterialCommunityIcons name="calendar" size={16} color="black" />
            <Text className="ml-2 text-sm font-medium text-black">
              {format(new Date(item.createdAt), "dd MMMM yyyy à HH:mm", {
                locale: fr,
              })}
            </Text>
          </View>
        </View>
        <View className="flex flex-col gap-1">
          <View className="flex flex-row items-center justify-end">
            <Text className="ml-2 text-sm font-extrabold text-black">
              {item.payment ? toPrice(item.payment?.total) : "inconnu"}
            </Text>
          </View>
          <View className="flex flex-row items-center">
            <MaterialCommunityIcons name="walk" size={16} color="black" />
            <Text className="ml-2 text-sm font-medium text-black">
              {item.delivery?.deliveryPerson ? toName(item.delivery.deliveryPerson) : "Inconnu"}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
