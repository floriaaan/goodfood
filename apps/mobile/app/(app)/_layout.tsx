import { Drawer } from "expo-router/drawer";

import { DrawerContent } from "@/components/ui/(app)/drawer";

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
