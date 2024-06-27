import { useStripe } from "@stripe/stripe-react-native";
import { useQuery } from "@tanstack/react-query";
import { useNavigation } from "expo-router";
import React from "react";
import { Alert, Linking } from "react-native";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useBasket } from "@/hooks/useBasket";
import { fetchAPI } from "@/lib/fetchAPI";

export default function CheckoutScreen() {
  const { session, user } = useAuth();
  const { selectedRestaurantId } = useBasket();
  const { initPaymentSheet, presentPaymentSheet, handleURLCallback } = useStripe();

  const { navigate } = useNavigation() as {
    navigate: (href: string, params?: any) => void;
    goBack: () => void;
  };

  const { data: paymentIntent, isLoading } = useQuery<{
    setupintent: string;
    ephemeralkey: string;
    customer: string;
    paymentid: string;
  }>({
    queryKey: ["stripe"],
    queryFn: async () => {
      if (!session?.token || !user) return;
      const res = await fetchAPI("/api/payment/stripe/create-intent", session?.token, {
        method: "POST",
      });
      const body = await res.json();
      if (!body) return;

      const initialUrl = await Linking.getInitialURL();

      const stripeHandled = await handleURLCallback(initialUrl || "");
      const returnURL = stripeHandled ? initialUrl || "" : "http://localhost:3000";

      await initPaymentSheet({
        returnURL,
        merchantDisplayName: "GoodFood",
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
    enabled: !!session?.token && !!user,
  });

  if (!user) return null;

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      try {
        const paymentId = paymentIntent?.paymentid;
        console.log("paymentId", paymentId);

        const delivery_req = await fetchAPI("/api/delivery", session?.token, {
          method: "POST",
          body: JSON.stringify({
            address: user.mainaddress,
            restaurantId: selectedRestaurantId,
          }),
        });
        const { id: deliveryId } = await delivery_req.json();
        console.log("deliveryId", deliveryId);

        const order_req = await fetchAPI("/api/order", session?.token, {
          method: "POST",
          body: JSON.stringify({
            deliveryId,
            deliveryType: "DELIVERY",
            paymentId,
            restaurantId: selectedRestaurantId,
          }),
        });
        const { id: orderId } = await order_req.json();
        console.log("orderId", orderId);

        // get id of order related to payment
        // navigate(`(app)`, { screen: "delivery/index" });
        navigate(`(app)`, {
          screen: "orders/[id]/index",
          params: { id: orderId },
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <Button
      onPress={openPaymentSheet}
      title="Payer ma commande"
      icon="credit-card-outline"
      disabled={isLoading}
      textClassName="text-white font-bold text-[18px] text-center uppercase"
    />
  );
}
