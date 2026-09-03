import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { paymentService } from "@/services/paymentService";
import { sessionService } from "@/services/sessionService";
import { StripeCheckoutForm } from "./StripeCheckoutForm";
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

    if (!isOpen || !activeIdConsulta) return null;

    return (
        <div className={classes.overlay} onClick={onClose}>    
            <div className={classes.container} onClick={(e) => e.stopPropagation()}>
                <h2 className={classes.title}>Conclusão de Consulta - Pagamento</h2>
                
                {isLoading ? (
                    <div className={classes.loading}>Carregando checkout...</div>
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
                    clientSecret && stripePromise && (
                        <Elements stripe={stripePromise} options={{ clientSecret, locale: 'pt-BR' }}>
                            <StripeCheckoutForm onSuccess={async () => {
                                if (activeIdConsulta) {
                                    try {
                                        await sessionService.updateSession(activeIdConsulta, {
                                            status_pagamento: "Pago"
                                        });
                                    } catch (err) {
                                        console.error("Erro ao atualizar status de pagamento:", err);
                                    }
                                }
                                if (onClose) onClose();
                                window.location.reload();
                            }} />
                        </Elements>
                    )
                )}
            </div>
        </div>
    );
};


