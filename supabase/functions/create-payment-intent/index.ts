import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.25.0?target=deno";
import { getCorsHeaders } from "../_shared/cors.ts";

const VALOR_MINIMO_PARCELAMENTO_CENTAVOS = 25000;
const MAX_PARCELAS = 12;

serve(async (req: Request): Promise<Response> => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Método não permitido" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 405,
      });
    }
    
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Token de autenticação não fornecido" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const supabaseAuthClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user },
      error: authError,
    } = await supabaseAuthClient.auth.getUser();

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Sessão inválida ou expirada" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        }
      );
    }

    const { id_consulta } = await req.json();

    if (!id_consulta) {
      return new Response(
        JSON.stringify({ error: "O parâmetro id_consulta é obrigatório" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? supabaseAnonKey;
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

    const { data: consulta, error: consultaError } = await supabaseClient
      .from("consulta")
      .select("id_consulta, valor_cobrado, procedimento(price)")
      .eq("id_consulta", id_consulta)
      .single();

    if (consultaError || !consulta) {
      console.error("[create-payment-intent] Erro ao buscar consulta:", consultaError);
      return new Response(
        JSON.stringify({ error: "Consulta não encontrada no banco de dados" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        }
      );
    }

  const valor = consulta.valor_cobrado ?? (consulta as any).procedimento?.price;

  if (!valor || valor <= 0) {
    return new Response(
      JSON.stringify({ error: "O valor da consulta não foi definido ou é inválido para cobrança." }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
    const amountInCents = Math.round(valor * 100);

    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      throw new Error("Chave STRIPE_SECRET_KEY não configurada nos segredos do Supabase");
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });

    const permiteParcelamento = amountInCents >= VALOR_MINIMO_PARCELAMENTO_CENTAVOS;

    const installmentsConfig = permiteParcelamento
      ? {
          enabled: true,
          plan: {
            maximum_count: MAX_PARCELAS,
          },
        }
      : {
          enabled: false,
        };

    const paymentIntentPayload: Stripe.PaymentIntentCreateParams = {
      amount: amountInCents > 0 ? amountInCents : 5000,
      currency: "brl",
      metadata: { 
        id_consulta,
        parcelamento_habilitado: permiteParcelamento ? "sim" : "nao",
      },
      automatic_payment_methods: { enabled: true },
    };

    if (permiteParcelamento) {
      paymentIntentPayload.payment_method_options = {
        card: {
          installments: {
            enabled: true,
            plan: { maximum_count: MAX_PARCELAS },
          },
        },
      };
    }

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentPayload);

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentId: paymentIntent.id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("[create-payment-intent] Erro:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro interno do servidor";
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});