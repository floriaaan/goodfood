import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/auth";
import { FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthLogin() {
  const { setUser } = useAuth();
  const [email, setEmail] = useState("jean.bon@courriel.fr");
  const [password, setPassword] = useState("MotDePasse");

  return (
    <View className="flex flex-col justify-between w-screen h-screen p-6 pb-16 bg-white">
      <View className="absolute bottom-0 left-0 w-screen h-32 bg-black"></View>
      <SafeAreaView className="flex flex-col justify-between h-full">
        <Image
          className="w-32 h-32"
          source={require("@/assets/images/logo.png")}
        />
        <View className="flex flex-col gap-2 grow">
          <Text className="text-black font-bold text-[20px] mb-6">
            Se connecter
          </Text>

          <Input
            keyboardType="email-address"
            placeholder="Adresse email"
            value={email}
            onChangeText={setEmail}
          />
          <Input
            secureTextEntry
            placeholder="Mot de passe"
            value={password}
            onChangeText={setPassword}
          />

          <View className="flex flex-row justify-between">
            <Text className="text-black underline">Mot de passe oublié ?</Text>
            <Text className="text-black underline">S'inscrire</Text>
          </View>
          <Text className="mt-6 text-black/60">Ou se connecter avec</Text>
          <View className="flex flex-row items-center p-2 border-2 border-gray-100 bg-gray-50">
            <TouchableOpacity className="flex items-center justify-center w-16 h-16 mr-2 bg-white">
              <FontAwesome5 name="google" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity className="flex items-center justify-center w-16 h-16 mr-2 bg-white">
              <FontAwesome5 name="apple" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity className="flex items-center justify-center w-16 h-16 mr-2 bg-white">
              <FontAwesome5 name="facebook" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
        <Button
          title="C'est parti !"
          onPress={() => {
            setUser({ token: "token" });
            router.push("/(app)/home");
          }}
          icon="chevron-right"
        />
      </SafeAreaView>
    </View>
  );
}
