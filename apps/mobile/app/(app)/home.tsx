import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BasketHeader } from "@/components/basket/header";
import { ProductCard } from "@/components/product/card";
import { Skeleton } from "@/components/product/skeleton";
import { RestaurantCard } from "@/components/restaurant/card";
import { AppHeader } from "@/components/ui/header";
import { CategoryHeader } from "@/components/ui/header/category";
import { useBasket } from "@/hooks/useBasket";
import { useLocation } from "@/hooks/useLocation";

export default function Index() {
  const { products, selectedRestaurantId } = useBasket();
  const { restaurants, loading } = useLocation();

  return (
    <View className="relative flex flex-col justify-between w-screen h-screen p-6 pb-16 bg-white">
      <View className="absolute bottom-0 left-0 w-screen bg-black h-96" />
      <SafeAreaView className="flex flex-col w-full h-full gap-4">
        <View className="w-full">
          <AppHeader />
        </View>
        <View className="w-full">
          <BasketHeader />
        </View>
        <View className="w-full">
          <Link
            href={{
              pathname: "/(app)/products/list/",
            }}
            style={{
              width: "100%",
              height: 48,
              backgroundColor: "rgba(0,0,0,0.05)",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                flex: 1,
                justifyContent: "center",
                width: "100%",
                paddingTop: 6,
                marginLeft: 72,
              }}
            >
              <MaterialCommunityIcons name="magnify" size={24} />
              <Text className="ml-1 text-lg font-bold text-black ">Rechercher un produit</Text>
            </View>
          </Link>
        </View>

        <View className="flex flex-row items-center">
          <CategoryLink icon="bowl-mix" title="Entrées" type="ENTREES" marginRight={16} fixMarginLeft={32} />
          <CategoryLink icon="food" title="Plats" type="PLATS" marginRight={0} fixMarginLeft={48} />
        </View>
        <View className="flex flex-row items-center">
          <CategoryLink icon="muffin" title="Desserts" type="DESSERTS" marginRight={16} fixMarginLeft={32} />
          <CategoryLink icon="food-apple" title="Snacks" type="SNACKS" marginRight={0} fixMarginLeft={48} />
        </View>
        <View>
          {(!selectedRestaurantId || products.length <= 0) && (
            <>
              <Text className="absolute z-40 text-lg font-bold text-center text-white top-12 left-5">
                Veuillez séléctionner un restaurant pour voir les produits
              </Text>
              <View className="absolute top-0 left-0 z-20 w-screen p-2 bg-black h-96 opacity-70" />
            </>
          )}
          <FlatList
            className="flex-grow-0 w-screen shrink-0"
            horizontal
            data={products}
            renderItem={({ item }) => <ProductCard {...item} />}
            ListEmptyComponent={
              products.length === 0 ? (
                <>
                  <Skeleton />
                  <Skeleton />
                </>
              ) : (
                <></>
              )
            }
          />
        </View>
        <View className="w-full">
          <CategoryHeader
            title="Liste des restaurants"
            subtitle="On est ici, par là, un peu ici, un peu partout en fait !"
            href="restaurants/index"
          />
        </View>
        <FlatList
          className="flex-grow w-full shrink-0 max-h-48"
          data={restaurants}
          renderItem={({ item }) => (
            <RestaurantCard restaurant={item} onClick={() => {}} selected={selectedRestaurantId === item.id} />
          )}
          ListEmptyComponent={() => {
            return (
              <View className="p-3">
                {loading ? (
                  <ActivityIndicator size="large" />
                ) : (
                  <Text className="text-white">Aucun restaurant trouvé</Text>
                )}
              </View>
            );
          }}
        />
      </SafeAreaView>
    </View>
  );
}

const CategoryLink = ({
  icon,
  title,
  type,
  marginRight = 0,
  fixMarginLeft,
}: {
  icon: string;
  title: string;
  type: string;
  marginRight: number;
  fixMarginLeft: number;
}) => {
  return (
    <Link
      href={{
        pathname: "/(app)/products/list/",
        params: { type },
      }}
      style={{
        width: "50%",
        height: 48,
        marginRight,
        backgroundColor: "rgba(0,0,0,0.05)",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          flex: 1,
          justifyContent: "center",
          width: "100%",
          marginLeft: fixMarginLeft,
        }}
      >
        {/* @ts-ignore */}
        <MaterialCommunityIcons name={icon} size={24} />
        <Text className="mt-1.5 ml-1 text-lg font-bold text-black">{title}</Text>
      </View>
    </Link>
  );
};
