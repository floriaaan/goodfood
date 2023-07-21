import { UserLocation } from "@/components/user/location";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, TouchableOpacity, View } from "react-native";

export const AppHeader = () => {
  return (
    <View
      key={"header"}
      className="flex flex-row items-center justify-between w-full "
    >
      <TouchableOpacity className="flex items-center justify-center w-12 h-12 bg-white">
        <MaterialCommunityIcons name="menu" size={32} color="black" />
      </TouchableOpacity>
      <UserLocation />
      <Image
        className="w-10 h-10 ml-2 bg-white"
        source={require("@/assets/images/avatar.png")}
      />
    </View>
  );
};
