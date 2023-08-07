import { useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";

export const UserLocation = () => {
  const refRBSheet = useRef<RBSheet>(null);

  return (
    <>
      <TouchableOpacity onPress={() => refRBSheet.current?.open()} className="flex flex-col">
        <Text className="text-sm font-bold text-black">24 rue Émile Zola - 76100 Rouen</Text>
        <Text className="text-xs text-black/60">mercredi 18 janvier - 12:15 - 12:35</Text>
      </TouchableOpacity>
      <RBSheet ref={refRBSheet} closeOnDragDown closeOnPressMask>
        <View className="absolute flex items-center flex-1 w-full h-full bg-white">
          <Text>Awesome 🎉</Text>
        </View>
      </RBSheet>
    </>
  );
};
