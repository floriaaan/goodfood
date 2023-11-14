"use client";

import { CheckoutRecap } from "@/app/(user)/checkout/recap";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { DeliveryType, Order } from "@/types/order";
import { useState } from "react";
import { MdCheck, MdLock, MdShoppingBasket } from "react-icons/md";

import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { LargeComponentLoader } from "@/components/ui/loader/large-component";
import { CheckoutReceipt } from "@/app/(user)/checkout/receipt";
import { orderList, restaurantList } from "@/constants/data";

import { TiLocationArrow } from "react-icons/ti";

import { Player } from "@lottiefiles/react-lottie-player";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

export default function CheckoutPage() {
  const [deliveryType, setDeliveryType] = useState(DeliveryType.DELIVERY);

  const [delivery_isModalOpen, setDelivery_isModalOpen] = useState(false);
  const [delivery_checkoutSessionSecret, setDelivery_checkoutSessionSecret] = useState("");

  const [takeaway_isModalOpen, setTakeaway_isModalOpen] = useState(false);

  const [order, setOrder] = useState<Order | null>(orderList[0]);

  return (
    <div className="flex h-full grow p-4 pb-12">
      <div className="mx-auto flex h-fit w-full max-w-6xl flex-col-reverse gap-2 lg:grid lg:grid-cols-3">
        <main className="sticky col-span-2  flex w-full flex-col gap-2 border border-gray-100 bg-white p-4">
          <h2 className="text-xl font-semibold">Paiement</h2>
          <small>Sélectionnez votre mode de paiement</small>
          <RadioGroup
            onValueChange={(e) => {
              setDeliveryType(e as DeliveryType);
            }}
            defaultValue={DeliveryType.DELIVERY}
          >
            <Label
              htmlFor={DeliveryType.TAKEAWAY}
              className={cn(
                "h-full w-full cursor-pointer leading-6",
                "flex cursor-pointer items-center gap-x-2 border p-4",
                deliveryType !== DeliveryType.TAKEAWAY && "opacity-50",
              )}
            >
              <RadioGroupItem value={DeliveryType.TAKEAWAY} id={DeliveryType.TAKEAWAY} />
              {"Je paye sur place et j’emporte ma commande"}
            </Label>
            <Label
              htmlFor={DeliveryType.DELIVERY}
              className={cn(
                "w-full cursor-pointer leading-6",
                "flex cursor-pointer items-center gap-x-2 border p-4",
                deliveryType !== DeliveryType.DELIVERY && "opacity-50",
              )}
            >
              <RadioGroupItem value={DeliveryType.DELIVERY} id={DeliveryType.DELIVERY} />
              Je fais livrer ma commande et je paye maintenant par carte bancaire
            </Label>
          </RadioGroup>

          <div className="w-full">
            {deliveryType === DeliveryType.DELIVERY && (
              <>
                {/* DELIVERY */}
                <Button
                  className="h-16 w-full"
                  onClick={() => {
                    // TODO: stripe
                    setDelivery_isModalOpen(true);
                  }}
                >
                  <MdShoppingBasket className="h-4 w-4 shrink-0" />
                  Payer
                </Button>
                <Dialog onOpenChange={setDelivery_isModalOpen} open={delivery_isModalOpen}>
                  <DialogContent className="flex aspect-video h-auto max-w-4xl items-center justify-center">
                    <div id="checkout">
                      {delivery_checkoutSessionSecret ? (
                        <EmbeddedCheckoutProvider
                          stripe={stripePromise}
                          options={{ clientSecret: delivery_checkoutSessionSecret }}
                        >
                          <EmbeddedCheckout />
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
            {deliveryType === DeliveryType.TAKEAWAY && (
              <>
                {/* TAKEAWAY */}
                <Button
                  className="h-16 w-full"
                  onClick={() => {
                    // TODO: create order
                    setTakeaway_isModalOpen(true);
                  }}
                >
                  <MdCheck className="h-4 w-4 shrink-0" />
                  Finaliser et payer sur place
                </Button>
                <Dialog onOpenChange={setTakeaway_isModalOpen} open={takeaway_isModalOpen}>
                  <DialogContent className="grid aspect-video h-auto max-w-4xl grid-cols-2 gap-2 ">
                    {order &&
                      (() => {
                        const restaurant = restaurantList.find((r) => r.id === order.restaurant_id);
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
                                <Player
                                  autoplay
                                  src={"https://lottie.host/a4822d55-540f-4efa-8d47-b87b633e1e64/qDllUOhZG4.json"}
                                  loop
                                  speed={1}
                                />
                              </div>
                              <Button asChild>
                                <a
                                  href={`https://www.google.com/maps?q=${restaurant.locationList[0]},${restaurant.locationList[1]}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <TiLocationArrow className="-mt-0.5 h-6 w-6 shrink-0" />
                                  {"J'y vais"}
                                </a>
                              </Button>
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
          <CheckoutRecap />
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
    </div>
  );
}
