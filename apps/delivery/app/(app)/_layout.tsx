import { useAuth } from "@/hooks/useAuth";
import { DataProvider } from "@/hooks/useData";
import { MaterialIcons } from "@expo/vector-icons";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Image } from "expo-image";
import { useNavigation } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { StyleSheet, Text, View } from "react-native";

export default function Layout() {
  return (
    // <GestureHandlerRootView style={{ flex: 1 }}>
    <DataProvider>
      {/* @ts-ignore */}
      <Drawer drawerContent={(props) => <DrawerContent {...props} />}>
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: "Home",
            drawerIcon: ({ color, size }) => (
              <MaterialIcons name="home" {...{ color, size }} />
            ),
            title: "overview",
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="order/[id]"
          options={{
            drawerLabel: "Order",
            drawerIcon: ({ color, size }) => (
              <MaterialIcons name="list" {...{ color, size }} />
            ),
            title: "order",
            headerShown: false,
          }}
        />

        <Drawer.Screen
          name="settings"
          options={{
            drawerLabel: "Paramètres",
            drawerIcon: ({ color, size }) => (
              <MaterialIcons name="settings" {...{ color, size }} />
            ),
            title: "Paramètres",
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="profile"
          options={{
            drawerLabel: "Profil",
            drawerIcon: ({ color, size }) => (
              <MaterialIcons name="account-circle" {...{ color, size }} />
            ),
            title: "Profil",
            headerShown: false,
          }}
        />
      </Drawer>
    </DataProvider>
    // </GestureHandlerRootView>
  );
}

function DrawerContent({ ...props }: typeof DrawerContentScrollView) {
  const { user, logout } = useAuth();
  const navigation = useNavigation() as {
    navigate: (href: string, params?: any) => void;
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerContent}>
        <View style={styles.userInfoSection}>
          <Image
            source={require("@/assets/images/tmp/user.png")}
            style={{ width: 64, height: 64 }}
          />
          <Text style={styles.title}>{user?.firstName}</Text>
          {/*<Caption style={styles.caption}>@trensik</Caption>*/}
        </View>
        <View style={styles.drawerSection}>
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialIcons name="home" {...{ color, size }} />
            )}
            label="Accueil"
            onPress={() => navigation.navigate("index")}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialIcons name="account-circle" {...{ color, size }} />
            )}
            label="Profil"
            onPress={() => navigation.navigate("profile", { id: user?.id })}
          />
        </View>
        <View>
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialIcons name="settings" {...{ color, size }} />
            )}
            label="Paramètres"
            onPress={() => navigation.navigate("settings")}
          />
        </View>

        <View>
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialIcons name="logout" {...{ color, size }} />
            )}
            label="Se déconnecter"
            onPress={() => logout()}
          />
        </View>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
    flexDirection: "column",
  },
  title: {
    marginTop: 20,
    fontWeight: "900",
    fontSize: 32,
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  paragraph: {
    fontWeight: "bold",
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
});
