import { View } from "react-native";

export const Skeleton = () => {
  return (
    <View className="relative flex flex-col mr-4 w-52 animate-pulse">
      <View className="w-full bg-gray-300 h-28 dark:bg-neutral-800" />
      <View className="absolute flex flex-row space-x-1 top-2 left-2">
        <View className="px-1 py-0.5 w-12">
          <View className="h-2 bg-gray-200 rounded-full dark:bg-neutral-800" />
        </View>
      </View>
      <View className="absolute top-[88px] right-2 px-1 py-0.5  w-12 h-3 bg-gray-100 rounded-full" />

      <View className="p-[15px] bg-white border-t border-black">
        <View className="h-2 bg-gray-200 rounded-full dark:bg-neutral-800" />
      </View>
    </View>
  );
};
