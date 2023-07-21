import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

export const Button = ({
  onPress,
  title,
  className,
  icon,
}: {
  onPress: () => void;
  title: string;
  className?: string;
  icon?: typeof Icon.defaultProps.name;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={
        className ||
        "bg-[#008D5E] flex flex-row px-6 h-16 items-center justify-between"
      }
    >
      {icon && <View className="w-6"></View>}
      <Text className="text-white font-bold text-[24px] text-center uppercase">
        {title}
      </Text>
      {icon && <Icon name={icon} size={24} color="#fff" />}
    </TouchableOpacity>
  );
};
