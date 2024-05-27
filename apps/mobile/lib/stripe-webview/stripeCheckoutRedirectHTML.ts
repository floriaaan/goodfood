/* @flow */

/**
 * Generates HTML content that redirects to a Stripe checkout session
 */
const stripeCheckoutRedirectHTML = (stripe_public_key: string): string => {
  if (!stripe_public_key) {
    throw new Error("Must provide Stripe public key.");
  }

  /** Get options or defaults */
  const {
    htmlContentLoading = '<h1 id="sc-loading">Loading...</h1>',
    htmlContentError = '<div id="sc-error-message"></div>',
    htmlContentHead = "",
  } = {};

  /** Return html */
  return `
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Stripe Checkout</title>
      <meta name="author" content="A-Tokyo">
      ${htmlContentHead || ""}
    </head>
    <body>
      <!-- Display loading content -->
      ${htmlContentLoading || ""}
      <!-- Display error content -->
      ${htmlContentError || ""}
      <!-- Exec JS without blocking dom -->      
      <!-- Load Stripe.js -->
      <script src="https://js.stripe.com/v3"></script>
      <!-- Stripe execution script -->
      <script>
        (function initStripeAndRedirectToCheckout () {
          const stripe = Stripe('${stripe_public_key}');
          window.onload = () => {
            console.log('RNSC: window loaded');
            
            stripe.redirectToCheckout(${JSON.stringify({})})
            .then((result) => {
                console.log('RNSC: window loaded', result);
                
                const loadingElement = document.getElementById('sc-loading');
                if (loadingElement) {
                  loadingElement.outerHTML = '';
                }
                
                if (result.error) {
                  const displayError = document.getElementById('sc-error-message');
                  if (displayError) {
                    displayError.textContent = result.error.message;
                  }
                }
              }).catch((err) => {
                console.error('RNSC: err', err);
              });
          };
        })();
      </script>
    </body>
  </html>
  `;
};

export default stripeCheckoutRedirectHTML;
