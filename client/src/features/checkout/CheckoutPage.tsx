import { Grid2, Typography } from "@mui/material";
import OrderSummary from "../../app/shared/components/OrderSummary";
import CheckoutStepper from "./CheckoutStepper";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { useFetchBasketQuery } from "../basket/basketApi";
import { Elements } from "@stripe/react-stripe-js";
import { useEffect, useMemo, useRef } from "react";
import { useCreatePaymentIntentMutation } from "./CheckoutApi";
import { useAppSelector } from "../../app/store/store";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);
//const stripePromise2 = loadStripe(process.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function CheckoutPage() {
  const { data: basket } = useFetchBasketQuery(); //extract the basket data property from the useFetchBasketQuery hook
  const [createPaymentIntent] = useCreatePaymentIntentMutation();
  const create = useRef(false); // -> persistant value that does not trigger a re-render
  const {darkMode} = useAppSelector(state => state.ui);
  //useRef returns a mutable object that persists for the lifetime of the component

  useEffect(() => {
    //maybe only need in Dev mode
    if (!create.current) {
      createPaymentIntent(); //make sure the payment intent is created only once
      create.current = true;
    }
  }, []);

  //const basket = useFetchBasketQuery();
  const options: StripeElementsOptions | undefined = useMemo(() => {
    // useMemo optimizes performance by recalculating the value only when dependencies change
    if (!basket?.clientSecret) return undefined;
    return {
      clientSecret: basket.clientSecret,
      appearance: {
        label: 'floating',
        theme: darkMode ? 'night' : 'stripe',
      },
    };
  }, [basket?.clientSecret, darkMode]); // ,[] is the dependency array only run once when the component mounts
  // to void expensive calculation runs on every render.
  return (
    <Grid2 container spacing={2}>
      <Grid2 size={8}>
        {!stripePromise || !options ? (
          <Typography variant="h6">Loadiing checkout...</Typography>
        ) : (
          <Elements stripe={stripePromise} options={options}>
            <CheckoutStepper />
          </Elements>
        )}
        {/* <Elements stripe={stripePromise}>
                    <CheckoutStepper/>
                </Elements> */}
      </Grid2>
      <Grid2 size={4}>
        <OrderSummary />
      </Grid2>
    </Grid2>
  );
}
