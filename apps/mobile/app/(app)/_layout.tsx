import { Drawer } from "expo-router/drawer";

import { DrawerContent } from "@/components/ui/(app)/drawer";
import { BasketProvider } from "@/hooks/useBasket";
import { LocationProvider } from "@/hooks/useLocation";

export default function AppLayout() {
  return (
    <LocationProvider>
      <BasketProvider>
        <Drawer drawerContent={(props) => <DrawerContent {...props} />} screenOptions={{ headerShown: false }} />
      </BasketProvider>
    </LocationProvider>
  );
}
