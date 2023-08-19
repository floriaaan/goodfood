import { useNavigation } from "expo-router";
import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { OrderListItem } from "@/components/order/list/item";
import { AppHeader } from "@/components/ui/header";
import { orderList } from "@/constants/data";

export default function Orders() {
  const { navigate } = useNavigation() as {
    navigate: (href: string, params?: any) => void;
  };
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
            data={orderList}
            renderItem={({ item }) => <OrderListItem {...{ item, navigate }} />}
            ItemSeparatorComponent={() => <View className="h-2 border-t border-gray-200 mt-2" />}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}
