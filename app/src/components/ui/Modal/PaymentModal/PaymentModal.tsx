import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useQueryClient } from "@tanstack/react-query";
import { paymentService } from "@/services/paymentService";
import type { SessionDbRow } from "@/services/sessionService";
import { useToaster } from "@/contexts/ToasterContext/useToaster";
import Loading from "../../Loading/Loading";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { StripeCheckoutForm, type CheckoutResult } from "./StripeCheckoutForm";
import classes from "./PaymentModal.module.css";

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null;

interface PaymentModalProps {
    isOpen?: boolean;
    onClose?: () => void;
    idConsulta?: string | null;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
    isOpen = true,
    onClose,
    idConsulta: propIdConsulta
}) => {
    const queryClient = useQueryClient();
    const { addToast } = useToaster();
    const { id_consulta: routeIdConsulta } = useParams<{ id_consulta: string }>();
    const activeIdConsulta = propIdConsulta || routeIdConsulta;

    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const fetchPaymentIntent = async () => {
        if (!activeIdConsulta) return;

        setIsLoading(true);
        setErrorMessage(null);

        if (!stripePublicKey) {
            setErrorMessage("Chave pública do Stripe (VITE_STRIPE_PUBLIC_KEY) não configurada no ambiente.");
            setIsLoading(false);
            return;
        }

        try {
            const res = await paymentService.createPaymentIntent(activeIdConsulta);
            if (res?.clientSecret) {
                setClientSecret(res.clientSecret);
            } else {
                setErrorMessage("Não foi possível obter os dados da sessão de pagamento.");
            }
        } catch (err: any) {
            console.error("Erro ao iniciar pagamento: ", err);
            setErrorMessage(err?.message || "Erro ao conectar com o serviço de pagamento Stripe.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && activeIdConsulta) {
            fetchPaymentIntent();
        }
    }, [activeIdConsulta, isOpen]);

    const handleCheckoutResult = (result: CheckoutResult) => {
        queryClient.setQueryData<SessionDbRow[]>(QUERY_KEYS.SESSIONS.ALL, (old) =>
            old?.map((s) =>
                s.id_consulta === activeIdConsulta && s.status_pagamento !== "Pago"
                    ? { ...s, status_pagamento: "Processando" }
                    : s
            )
        );

        addToast(
            result === "succeeded"
                ? "Pagamento aprovado! Confirmando com o sistema..."
                : "Pagamento em processamento. O status será atualizado automaticamente.",
            "info"
        );

        if (onClose) onClose();
    };

    if (!isOpen || !activeIdConsulta) return null;

    return (
    <div className={classes.overlay} onClick={onClose}>
      <div className={classes.container} onClick={(e) => e.stopPropagation()}>
        <h2 className={classes.title}>Conclusão de Consulta - Pagamento</h2>

        {isLoading ? (
          <Loading variant="inline" message="Carregando checkout..." />
        ) : errorMessage ? (
          <div className={classes.errorContainer}>
            <p className={classes.errorMessage}>{errorMessage}</p>
            <div style={{ display: "flex", gap: "0.8rem", marginTop: "0.5rem" }}>
              <button className={classes.retryButton} onClick={fetchPaymentIntent}>
                Tentar Novamente
              </button>
              {onClose && (
                <button className={classes.closeButton} onClick={onClose}>
                  Fechar
                </button>
              )}
            </div>
          </div>
        ) : (
          clientSecret &&
          stripePromise && (
            <Elements stripe={stripePromise} options={{ clientSecret, locale: "pt-BR" }}>
              <StripeCheckoutForm onResult={handleCheckoutResult} />
            </Elements>
          )
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
