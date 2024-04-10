import { View } from "react-native";

export const Skeleton = () => {
  return (
    <View className="relative flex flex-col mr-4 w-52 animate-pulse">
      <View className="w-full h-28 bg-gray-300 dark:bg-neutral-800"></View>
      <View className="absolute flex flex-row space-x-1 top-2 left-2">
        <View className="px-1 py-0.5 w-12">
          <View className="h-2 bg-gray-200 rounded-full dark:bg-neutral-800"></View>
        </View>
      </View>
      <View className="absolute top-[88px] right-2 px-1 py-0.5  w-12 h-3 bg-gray-100 rounded-full"></View>

      <View className="p-3 bg-white border-t border-black">
        <View className="h-2 bg-gray-200 rounded-full dark:bg-neutral-800"></View>
      </View>
    </View>
  );
};
