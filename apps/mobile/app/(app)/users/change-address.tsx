import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Toast from "react-native-root-toast";
import { SafeAreaView } from "react-native-safe-area-context";

import { BackButton } from "@/components/ui/button/back";
import { AppHeader } from "@/components/ui/header";
import { SearchInput } from "@/components/ui/input/search";
import { useAuth } from "@/hooks/useAuth";
import { fetchAPI } from "@/lib/fetchAPI";
import { Prediction, getPlaceDetails, getPlacesSuggestions } from "@/lib/fetchers/externals/google-maps";

const ChangeAddressPage = () => {
  const { user, session } = useAuth();

  const [search, setSearch] = useState(user?.mainaddress.street || "");
  const timeout = useRef<NodeJS.Timer>();
  const [suggestions, setSuggestions] = useState<Prediction[]>([]);
  const [preventFromFetching, setPreventFromFetching] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [isSearching, setIsSearching] = useState<boolean>(false);

  const handleOnChange = (query: string) => {
    setSearch(query);
    setIsSearching(true);

    clearTimeout(timeout.current);

    if (!query.trim()) {
      setSuggestions([]);
      setIsOpen(false);
      setIsSearching(false);
      return;
    }

    timeout.current = setTimeout(async () => {
      if (!preventFromFetching) {
        const res = await getPlacesSuggestions(query);
        setSuggestions(res);
        setIsOpen(true);
        setIsSearching(false);
      }
    }, 2000);

    setPreventFromFetching(false);
  };

  if (!session || !user) return null;

  return (
    <>
      <View className="relative flex flex-col justify-between w-screen h-screen p-6 pb-16 bg-white">
        <View className="absolute bottom-0 left-0 w-screen h-20 bg-black" />
        <BackButton />
        <SafeAreaView className="flex flex-col w-full h-full gap-4">
          <View className="w-full">
            <AppHeader />
          </View>
          <View className="flex flex-col w-full">
            <SearchInput value={search} onChangeText={handleOnChange} label="Adresse" />
            {isSearching && (
              <View className="flex flex-col items-center justify-center w-full h-24 p-8">
                <ActivityIndicator size="small" />
                <Text className="mt-2 text-sm text-neutral-500">Recherche en cours...</Text>
              </View>
            )}
            {isOpen && (
              <View className="flex flex-col gap-4">
                <FlatList
                  data={suggestions}
                  renderItem={({ item }) => <Suggestion {...item} />}
                  keyExtractor={(item) => item.place_id}
                  className="w-full h-full grow"
                />
              </View>
            )}
          </View>
        </SafeAreaView>
      </View>
    </>
  );
};

const Suggestion = (suggestion: Prediction) => {
  const { user, session } = useAuth();
  if (!user || !session) return null;
  return (
    <TouchableOpacity
      onPress={async () => {
        try {
          const details = await getPlaceDetails(suggestion.place_id);
          if (!details) return;
          const res = await fetchAPI(`/api/user/main-address/${user.id}`, session.token, {
            method: "PUT",
            body: JSON.stringify({
              ...details,
              zipCode: details.zipcode,
              street: `${details.street} ${details.city}`,
              country: details.country || "France",
            }),
          });
          console.log(await res.json());

          if (res.ok)
            Toast.show("Adresse modifiée avec succès", {
              duration: Toast.durations.LONG,
              position: Toast.positions.BOTTOM,
              backgroundColor: "#4CAF50",
            });
        } catch (e) {
          console.log(e);
          Toast.show("Erreur lors de la modification de l'adresse", {
            duration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
            backgroundColor: "#F44336",
          });
        }
      }}
      key={suggestion.place_id}
      className="flex flex-col gap-2 mt-2"
    >
      <View className="flex flex-row items-center gap-2">
        <MaterialCommunityIcons name="map-marker" size={24} color="black" />
        <View className="flex flex-col gap-1">
          <Text className="text-sm">{suggestion.structured_formatting.main_text}</Text>
          <Text className="text-xs text-black/60">{suggestion.structured_formatting.secondary_text}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ChangeAddressPage;
