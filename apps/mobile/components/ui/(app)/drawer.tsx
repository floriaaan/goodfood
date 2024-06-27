import { MaterialCommunityIcons } from "@expo/vector-icons";
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { useNavigation } from "expo-router";

import { useAuth } from "@/hooks/useAuth";

export const DrawerContent = (props: DrawerContentComponentProps) => {
  const routeName = props.state.routeNames[props.state.index];
  const { logout } = useAuth();
  const { navigate } = useNavigation() as {
    navigate: (href: string, params?: any) => void;
  };

  return (
    <DrawerContentScrollView {...props} className="h-screen">
      {/* <DrawerItemList {...props} /> */}
      <DrawerItem
        label="Accueil"
        activeBackgroundColor="#008D5E33"
        activeTintColor="black"
        icon={({ color, size }) => <MaterialCommunityIcons name="home" color={color} size={size} />}
        focused={routeName === "home"}
        onPress={() => navigate("(app)", { screen: "home" })}
      />
      <DrawerItem
        label="Mon compte"
        activeBackgroundColor="#008D5E33"
        activeTintColor="black"
        icon={({ color, size }) => <MaterialCommunityIcons name="account" color={color} size={size} />}
        focused={routeName === "users/index"}
        onPress={() => navigate("(app)", { screen: "users/index" })}
      />
      <DrawerItem
        label="Mes commandes"
        activeBackgroundColor="#008D5E33"
        activeTintColor="black"
        icon={({ color, size }) => <MaterialCommunityIcons name="basket" color={color} size={size} />}
        focused={routeName === "orders/index"}
        onPress={() => navigate("(app)", { screen: "orders/index" })}
      />
      <DrawerItem
        label="Deconnexion"
        activeBackgroundColor="#008D5E33"
        activeTintColor="black"
        icon={({ color, size }) => <MaterialCommunityIcons name="logout" color={color} size={size} />}
        focused={routeName === "login"}
        onPress={() => {
          logout();
        }}
      />
    </DrawerContentScrollView>
  );
};
