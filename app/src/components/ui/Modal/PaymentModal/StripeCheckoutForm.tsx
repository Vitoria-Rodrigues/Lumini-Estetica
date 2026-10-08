import React, { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import Button from "../../Button/Button";

interface StripeProps {
    onSuccess: () => void;
}

export const StripeCheckoutForm: React.FC<StripeProps> = ({ onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState(false);
    const[errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);
    setErrorMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/session",
      },
      redirect: "if_required",
    });

    if (error) {
      setErrorMessage(error.message || "Erro ao processar o pagamento");
      setIsLoading(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setIsLoading(false);
      onSuccess();
    } else {
      setIsLoading(false);
      onSuccess();
    }
  };

    return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {errorMessage && (
        <div style={{ color: "#d00404", marginTop: 10, fontSize: "0.85rem" }}>
          {errorMessage}
        </div>
      )}
      <Button
        title="Confirmar Pagamento"
        type="submit"
        disabled={!stripe || isLoading}
        style={{ marginTop: 20, fontSize: 15, backgroundColor: "#178301", width: "100%" }}
      >
        {isLoading ? "Processando..." : "Confirmar e Pagar"}
      </Button>
    </form>
  );
};
