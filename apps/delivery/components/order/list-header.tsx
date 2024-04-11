import { Text, View } from "react-native";

export const OrderListHeader = () => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        width: "100%",
      }}
    >
      <Text style={{ color: "white", fontSize: 20, fontWeight: "700" }}>
        Vos commandes attribuées
      </Text>
      <View
        style={{
          paddingHorizontal: 8,
          paddingVertical: 2,
          backgroundColor: "#B6E8D8",
        }}
      >
        <Text
          style={{
            color: "#008D5E",
            fontSize: 18,
            fontWeight: "800",
          }}
        >
          2
        </Text>
      </View>
    </View>
  );
};
