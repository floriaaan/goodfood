import { useNavigation } from "expo-router";
import { FlatList, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { OrderListItem } from "@/components/order/list/item";
import { AppHeader } from "@/components/ui/header";
import { Order } from "@/types/order";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/lib/fetchAPI";
import { useAuth } from "@/hooks/useAuth";
import { useMemo } from "react";

export default function Orders() {
  const { session, isAuthenticated } = useAuth();
  const { navigate } = useNavigation() as {
    navigate: (href: string, params?: any) => void;
  };
  const {
    data: api_orders,
    isLoading,
    isError,
  } = useQuery<Order[]>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["user", "order", "user", session?.user?.id],
    queryFn: async () => {
      const res = await fetchAPI(`/api/order/by-user/${session?.user?.id}`, session?.token);
      const body = await res.json();
      return body.ordersList;
    },
    staleTime: 1000 * 60 * 5,
    enabled: isAuthenticated,
  });
  const orders = useMemo(() => api_orders || [], [api_orders]);

  return (
    <View className="relative flex flex-col justify-between w-screen h-screen p-6 pb-16 bg-white">
      {/* <View className="absolute bottom-0 left-0 w-screen bg-black h-32" /> */}
      <SafeAreaView className="flex flex-col w-full h-full gap-4">
        <View className="w-full">
          <AppHeader />
        </View>
        <View className="w-full grow">
          <FlatList
            className="grow"
            data={orders}
            renderItem={({ item }) => <OrderListItem {...{ item, navigate }} />}
            ItemSeparatorComponent={() => <View className="h-2 border-t border-gray-200 mt-2" />}
            ListEmptyComponent={() => (
              <View className="flex flex-col items-center justify-center h-64">
                <Text className="text-black">Aucune commande</Text>
              </View>
            )}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}
