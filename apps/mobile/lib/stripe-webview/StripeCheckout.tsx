/* @flow */
import React, { ReactNode, SyntheticEvent, useState } from "react";
import { Text } from "react-native";
import { WebView } from "react-native-webview";

import stripeCheckoutRedirectHTML from "./stripeCheckoutRedirectHTML";

type Props = {
  /** Stripe public key */
  stripePublicKey: string;
  /** Stripe Checkout Session input */
  checkoutSessionInput: {
    sessionId: string;
  };
  /** Called when the Stripe checkout session completes with status 'success' */
  onSuccess: ({ checkoutSessionId }: { checkoutSessionId: string }) => any;
  /** Called when the Stripe checkout session completes with status 'cancel' */
  onCancel: () => any;
  /** Called when the Stripe checkout session webpage loads successfully */
  onLoadingComplete?: (syntheticEvent: SyntheticEvent) => any;
  /** Extra options */
  options?: {
    /** The loading item is set on the element with id='sc-loading' */
    htmlContentLoading?: string;
    /** The error is set on the element with id='sc-error-message' */
    htmlContentError?: string;
  };
  /** Props passed to the WebView */
  webViewProps?: object;
  /** Renders the component shown when checkout session is completed */
  renderOnComplete?: () => ReactNode;
};

/**
 * StripeCheckoutWebView
 *
 * Handles a full Stripe Checkout journey on react native via webview
 *
 * Important Notes about URLs:
 * - successUrl must have the query string params `?sc_checkout=success&sc_sid={CHECKOUT_SESSION_ID}`
 *   - sc_sid is optional - must be the last param - when passed results in sessionId being passed to the onSuccess function
 * - cancelUrl must have the query string params `?sc_checkout=cancel`
 */
const StripeCheckoutWebView = (props: Props) => {
  const {
    stripePublicKey,
    checkoutSessionInput,
    onSuccess,
    onCancel,
    onLoadingComplete,
    options,
    webViewProps = {},
    renderOnComplete,
  } = props;
  /** Holds the complete URL if exists */
  const [completed, setCompleted] = useState<boolean | null>(null);
  /** Holds wether Stripe Checkout has loaded yet */
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);

  const onloadstart = () => {
    const { nativeEvent } = syntheticEvent;
    if (nativeEvent.url === STR)

  }

  /**
   * Called upon URL load complete
   */
  const _onLoadEnd = (syntheticEvent: SyntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    /** set isLoading to false once the stripe checkout page loads */
    // @ts-ignore
    if (!hasLoaded && nativeEvent.url.startsWith("https://checkout.stripe.com") && onLoadingComplete) {
      setHasLoaded(true);
      onLoadingComplete(syntheticEvent);
    }
    /** call webViewProps.onLoadStart */
    // @ts-ignore
    if (webViewProps && webViewProps.onLoadEnd) {
      // @ts-ignore
      webViewProps.onLoadEnd(syntheticEvent);
    }
  };

  /** If the checkout session is complete -- render the complete content */
  if (completed) {
    return renderOnComplete ? (
      // @ts-ignore
      renderOnComplete({ url: completed, ...props })
    ) : (
      <Text>Stripe Checkout session complete.</Text>
    );
  }

  /** Render the WebView holding the Stripe checkout flow */
  return <WebView source={{ html: stripeCheckoutRedirectHTML(stripePublicKey) }} />;
};

export default StripeCheckoutWebView;
