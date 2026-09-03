import { supabase } from "./supabase";

export interface PaymentData{
    id_consulta: string;
    valor: number;
    metodo_pagamento?: string;
}

export const paymentService = {
    async createPaymentIntent(id_consulta: string): Promise<{clientSecret: string; paymentId: string}> {
        const { data, error } = await supabase.functions.invoke("create-payment-intent", {
            body: { id_consulta },
        });

        if(error) throw error;
        return data;
    },

    async getPaymentSession(id_consulta: string) {
        const { data, error } = await supabase.from("Pagamento")
        .select("*")
        .eq("id_consulta", id_consulta)
        .is("deleted_at", null)
        .single();

        if(error) throw error;
        return data;
    }
};