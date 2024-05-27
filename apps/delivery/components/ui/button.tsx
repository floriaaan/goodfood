import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { Text, TouchableOpacity, View } from "react-native";

export const Button = ({
  onPress,
  title,
  className,
  icon,
  type = "primary",
  disabled,
}: {
  onPress: () => void;
  title?: string;
  className?: string;
  icon?: typeof Icon.defaultProps.name;
  type?: "primary" | "secondary";
  disabled?: boolean;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        { height: "auto", flexDirection: "row", alignItems: "center" },
        type === "primary"
          ? { backgroundColor: "#008D5E" }
          : { backgroundColor: "neutral-800" },
        icon && !title ? { padding: 12 } : { padding: 16, },
        icon
          ? { justifyContent: "space-between" }
          : { justifyContent: "center" },
          disabled && { opacity: 0.2},
      ]}
    >
      {icon && title && <View style={{ width: 24, height: 24 }} />}
      <Text
        style={{
          color: "white",
          fontSize: 18,
          fontWeight: "700",
          padding: 6,
        }}
      >
        {title?.toUpperCase()}
      </Text>
      {icon && <Icon name={icon} size={24} color="#fff" />}
    </TouchableOpacity>
  );
};
