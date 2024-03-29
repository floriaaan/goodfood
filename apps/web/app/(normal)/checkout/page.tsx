"use client";

import { CheckoutRecap } from "@/app/(normal)/checkout/recap";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { DeliveryType, Order } from "@/types/order";
import { useState } from "react";
import { MdCheck, MdLock, MdRestaurant, MdShoppingBasket } from "react-icons/md";

import { CheckoutReceipt } from "@/app/(normal)/checkout/receipt";
import { orderList } from "@/constants/data";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { TiLocationArrow } from "react-icons/ti";

import { LargeComponentLoader } from "@/components/ui/loader/large-component";
import { NotFoundResource } from "@/components/ui/not-found-resource";
import { NotLogged } from "@/components/ui/not-logged";
import { useAuth, useBasket, useLocation } from "@/hooks";
import { fetchAPI } from "@/lib/fetchAPI";
import { Payment } from "@/types/payment";
import { Player } from "@lottiefiles/react-lottie-player";
import { useQuery } from "@tanstack/react-query";
import { HomeIcon } from "lucide-react";
import Link from "next/link";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

type PageProps = { params: { id: string } };

export default function CheckoutPage({}: PageProps) {
  // decode url encoded params.id
  const { user, session } = useAuth();
  const { restaurants } = useLocation();
  const { isAuthenticated, isBasketEmpty, isRestaurantSelected, selectedRestaurant } = useBasket();

  const [deliveryType, setDeliveryType] = useState(DeliveryType.DELIVERY.toString());

  const [delivery_isModalOpen, setDelivery_isModalOpen] = useState(false);
  const [delivery_checkoutSessionSecret, setDelivery_checkoutSessionSecret] = useState("");
  const [takeaway_isModalOpen, setTakeaway_isModalOpen] = useState(false);

  // TODO: implement takeway order creation
  // const [hasCreatedOrder, setHasCreatedOrder] = useState(false);
  const [
    order,
    // setOrder
  ] = useState<Order | null>(orderList[0]); // TODO: replace with real order

  useQuery<{ Payment: Payment; clientSecret: string }>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["payment", "stripe"],
    queryFn: async () => {
      const res = await fetchAPI(`/api/payment/stripe`, session?.token, {
        method: "POST",
        body: JSON.stringify({
          return_url_base: "http://localhost:3000",
        }),
      });
      const body = await res.json();
      setDelivery_checkoutSessionSecret(body.clientsecret);
      return body;
    },
  });

  if (!user) return <NotLogged />;
  if (!selectedRestaurant) return <NotFoundResource reason="Aucun restaurant sélectionné" />;

  return (
    <div className="flex h-full grow p-4 pb-12">
      {isAuthenticated && isRestaurantSelected && !isBasketEmpty && (
        <div className="mx-auto flex h-fit w-full max-w-6xl flex-col-reverse gap-2 lg:grid lg:grid-cols-3">
          <main className="sticky col-span-2  flex w-full flex-col gap-2 border border-gray-100 bg-white p-4">
            <h2 className="text-xl font-semibold">Paiement</h2>
            <small>Sélectionnez votre mode de paiement</small>
            <RadioGroup
              // disabled={hasCreatedOrder}
              onValueChange={setDeliveryType}
              defaultValue={DeliveryType.DELIVERY.toString()}
            >
              <Label
                htmlFor={DeliveryType.TAKEAWAY.toString()}
                className={cn(
                  "h-full w-full cursor-pointer leading-6",
                  "flex cursor-pointer items-center gap-x-2 border p-4",
                  deliveryType !== DeliveryType.TAKEAWAY.toString() && "opacity-50",
                )}
              >
                <RadioGroupItem value={DeliveryType.TAKEAWAY.toString()} id={DeliveryType.TAKEAWAY.toString()} />
                {"Je paye sur place et j’emporte ma commande"}
              </Label>
              <Label
                htmlFor={DeliveryType.DELIVERY.toString()}
                className={cn(
                  "w-full cursor-pointer leading-6",
                  "flex cursor-pointer items-center gap-x-2 border p-4",
                  deliveryType !== DeliveryType.DELIVERY.toString() && "opacity-50",
                )}
              >
                <RadioGroupItem value={DeliveryType.DELIVERY.toString()} id={DeliveryType.DELIVERY.toString()} />
                Je fais livrer ma commande et je paye maintenant par carte bancaire
              </Label>
            </RadioGroup>

            <div className="w-full">
              {deliveryType === DeliveryType.DELIVERY.toString() && (
                <>
                  {/* DELIVERY */}
                  <Button
                    className="h-16 w-full"
                    onClick={() => {
                      // TODO: stripe
                      // setHasCreatedOrder(true);
                      setDelivery_isModalOpen(true);
                    }}
                  >
                    <MdShoppingBasket className="h-4 w-4 shrink-0" />
                    Payer
                  </Button>
                  <Dialog
                    onOpenChange={setDelivery_isModalOpen}
                    open={
                      delivery_isModalOpen
                      //  || hasCreatedOrder
                    }
                  >
                    <DialogContent className="flex aspect-video max-h-screen w-screen items-center justify-center p-0">
                      <div id="checkout" className="w-full">
                        {delivery_checkoutSessionSecret ? (
                          <EmbeddedCheckoutProvider
                            stripe={stripePromise}
                            options={{
                              clientSecret: delivery_checkoutSessionSecret,
                            }}
                          >
                            <EmbeddedCheckout className="max-h-screen w-full pt-1" />
                          </EmbeddedCheckoutProvider>
                        ) : (
                          <div className="h-64 w-64">
                            <LargeComponentLoader />
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </>
              )}
              {deliveryType === DeliveryType.TAKEAWAY.toString() && (
                <>
                  {/* TAKEAWAY */}
                  <Button
                    className="h-16 w-full"
                    onClick={() => {
                      // TODO: create order
                      // setHasCreatedOrder(true);
                      setTakeaway_isModalOpen(true);
                    }}
                  >
                    <MdCheck className="h-4 w-4 shrink-0" />
                    Finaliser et payer sur place
                  </Button>
                  <Dialog
                    onOpenChange={setTakeaway_isModalOpen}
                    open={
                      takeaway_isModalOpen
                      //  || hasCreatedOrder
                    }
                  >
                    <DialogContent className="grid aspect-video h-auto max-w-4xl justify-center gap-2 md:grid-cols-2">
                      {order &&
                        (() => {
                          const restaurant = restaurants.find((r) => r.id === order.restaurantId);
                          if (!restaurant) return null;
                          return (
                            <>
                              <CheckoutReceipt {...order} />
                              <div className="mt-4 flex flex-col items-center gap-y-4 text-center">
                                <div className="">
                                  <h2 className="text-xl font-semibold">Votre commande est en attente</h2>
                                  <p className="text-sm">Vous pouvez venir la chercher dès maintenant au restaurant.</p>
                                </div>
                                <div className="grow">
                                  <Player autoplay src={"/assets/lottie/checkout-preparation.json"} loop speed={1} />
                                </div>
                                <div className="flex w-full flex-col gap-y-1">
                                  <Button variant={"ghost"} asChild>
                                    <Link href="/">
                                      <HomeIcon className="-mt-0.5 h-6 w-6 shrink-0" />
                                      Retour à la maison
                                    </Link>
                                  </Button>
                                  <Button asChild>
                                    <a
                                      href={`https://www.google.com/maps?q=${restaurant.address.lat},${restaurant.address.lng}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <TiLocationArrow className="-mt-0.5 h-6 w-6 shrink-0" />
                                      {"J'y vais"}
                                    </a>
                                  </Button>
                                </div>
                              </div>
                            </>
                          );
                        })()}
                    </DialogContent>
                  </Dialog>
                </>
              )}
            </div>
          </main>
          <div className="flex flex-col gap-1">
            <CheckoutRecap
              deliveryType={deliveryType}
              address={
                deliveryType === DeliveryType.DELIVERY.toString() ? user.mainaddress : selectedRestaurant.address
              }
            />
            <small className="mt-2 inline-flex flex-wrap items-center justify-center gap-1 text-center text-[10px] leading-3 text-gray-500">
              En passant votre commande, vous acceptez nos
              <u className="font-semibold">Conditions générales de vente</u>
            </small>
            <small className="mt-2 inline-flex flex-wrap items-center justify-center gap-1 text-center text-[10px] leading-3 text-gray-500">
              <MdLock className="h-4 w-4 shrink-0" />
              Paiement 100% sécurisé par <u className="font-semibold">Stripe</u>
            </small>
          </div>
        </div>
      )}
      {!isAuthenticated && (
        <div className="flex w-full flex-col items-center justify-center gap-2">
          <MdLock className="h-8 w-8" />
          <span className="text-xl font-semibold">Vous devez être connecté pour passer commande</span>
          <small className="text-sm">Vous pouvez le faire dans la barre de navigation</small>
          <hr className="border-gray-300" />

          <Button asChild className="w-64">
            <Link href="/auth/login">Se connecter</Link>
          </Button>
        </div>
      )}
      {isAuthenticated && !isRestaurantSelected && (
        <div className="flex w-full flex-col items-center justify-center gap-2">
          <MdRestaurant className="h-8 w-8" />
          <span className="text-xl font-semibold">Vous devez sélectionner un restaurant</span>
          <small className="text-sm">Vous pouvez le faire dans la barre de navigation</small>
        </div>
      )}
      {isAuthenticated && isRestaurantSelected && isBasketEmpty && (
        <div className="flex w-full flex-col items-center justify-center gap-2">
          <MdShoppingBasket className="h-8 w-8" />
          <span className="text-xl font-semibold">Votre panier doit contenir au moins un produit</span>
          <small className="text-sm">Vous pouvez le faire sur la page de catalogue</small>
          <hr className="border-gray-300" />
          <Button asChild className="w-64">
            <Link href="/">Voir le catalogue</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
