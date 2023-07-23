import { DrawerContent } from "@/components/ui/(app)/drawer";
import { Drawer } from "expo-router/drawer";

export default function AppLayout() {
  return (
    <Drawer
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
