import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { useStripe } from "@stripe/stripe-react-native";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Alert, Text, TouchableOpacity } from "react-native";

import { user } from "@/constants/data";
import { useAuth } from "@/hooks/useAuth";
import { fetchAPI } from "@/lib/fetchAPI";
import { useNavigation } from "expo-router";

export default function CheckoutScreen() {
  const { session } = useAuth();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const { goBack, navigate } = useNavigation() as {
    navigate: (href: string, params?: any) => void;
    goBack: () => void;
  };

  const { data: paymentIntent, isLoading } = useQuery<{
    setupintent: string;
    ephemeralkey: string;
    customer: string;
  }>({
    queryKey: ["stripe"],
    queryFn: async () => {
      const res = await fetchAPI("/api/payment/stripe/create-intent", session?.token, {
        method: "POST",
      });
      const body = await res.json();
      if (!body) return;
      await initPaymentSheet({
        merchantDisplayName: "Goodfood",
        customerId: body.customer,
        customerEphemeralKeySecret: body.ephemeralkey,
        paymentIntentClientSecret: body.setupintent,
        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: {
          email: user.email,
          name: user.firstName + " " + user.lastName,
        },
      });

      return body;
    },
  });

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      navigate(`(app)`, { screen: "delivery/index" });
    }
  };

  return (
    <TouchableOpacity
      className="flex items-center flex-row h-16 border px-6 text-sm  cursor-pointer "
      disabled={isLoading}
      onPress={openPaymentSheet}
    >
      <Icon name="credit-card-outline" size={18} />
      <Text className="font-bold text-sm pl-1">Payer ma commande</Text>
    </TouchableOpacity>
  );
}
