import { FontAwesome5 } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

export default function AuthLogin() {
  const { login } = useAuth();
  const [email, setEmail] = useState("user@mail.com");
  const [password, setPassword] = useState("password");

  return (
    <View
      style={{
        paddingBottom: 64,
        backgroundColor: "white",
        padding: 24,
        flex: 1,
        justifyContent: "space-between",
      }}
    >
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: Dimensions.get("window").width,
          height: 128,
          backgroundColor: "black",
        }}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <Image
          style={{
            width: 128,
            height: 128,
          }}
          source={require("@/assets/images/logo.png")}
        />
        <View
          style={{
            flex: 1,
            // justifyContent: "space-between",
            gap: 8,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "black",
              marginBottom: 24,
            }}
          >
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

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Link
              href="/(auth)/login"
              style={{
                color: "black",
                textDecorationLine: "underline",
              }}
            >
              Mot de passe oublié ?
            </Link>
            <Link
              href="/(auth)/login"
              style={{
                color: "black",
                textDecorationLine: "underline",
              }}
            >
              S'inscrire
            </Link>
          </View>
          <Text
            style={{
              marginTop: 24,
              color: "black",
              fontSize: 12,
            }}
          >
            Ou se connecter avec
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 8,
              borderColor: "rgba(0, 0, 0, 0.25)",
              borderWidth: 2,
              backgroundColor: "#F3F4F6",
              gap: 8,
            }}
          >
            <TouchableOpacity
              style={{
                width: 64,
                height: 64,
                backgroundColor: "white",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FontAwesome5 name="google" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: 64,
                height: 64,
                backgroundColor: "white",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FontAwesome5 name="apple" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: 64,
                height: 64,
                backgroundColor: "white",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FontAwesome5 name="facebook" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
        <Button
          title="C'est parti !"
          onPress={() => {
            login(email, password)
              .then((r) => {
                if (r.ok) router.push("/(app)/");
              })
              .catch(console.error);
          }}
          icon="chevron-right"
        />
      </SafeAreaView>
    </View>
  );
}
