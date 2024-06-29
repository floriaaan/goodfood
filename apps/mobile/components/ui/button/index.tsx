import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import classNames from "classnames";
import { Text, TouchableOpacity, View } from "react-native";

export const Button = ({
  onPress,
  title,
  className,
  icon,
  type = "primary",
  disabled = false,
  textClassName,
}: {
  onPress: () => void;
  title?: string;
  className?: string;
  icon?: typeof Icon.defaultProps.name;
  type?: "primary" | "secondary";
  disabled?: boolean;
  textClassName?: string;
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      className={classNames(
        type === "primary"
          ? "bg-[#008D5E] flex flex-row  h-16 items-center"
          : "bg-neutral-800 flex flex-row h-16 items-center",
        icon && !title ? "px-5" : "px-6",
        icon ? "justify-between" : "justify-center",
        disabled && "bg-[#656565]",
        className,
      )}
    >
      {icon && title && <View className="w-6" />}
      <Text className={textClassName || "text-white font-bold text-[24px] text-center uppercase"}>{title}</Text>
      {icon && <Icon name={icon} size={24} color="#fff" />}
    </TouchableOpacity>
  );
};
