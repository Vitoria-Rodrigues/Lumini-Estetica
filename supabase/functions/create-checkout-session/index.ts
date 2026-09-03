import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.25.0?target=deno";


const corsHeaders = {
    'Acsess-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req: Request): Promise<Response> => {
    if(req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        if(req.method !== 'POST') {
            return new Response(JSON.stringify({ error: 'Método não permitido'}), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 405,  
            })
        }

    const authHeader = req.headers.get('Authorization')
    if(!authHeader) {
        return new Response(JSON.stringify({ error: 'Nenhum token de autorização fornecido'}), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 401,
        })
    }

    const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? '',
        { global: { headers: { Authorization: authHeader } } }
      )

      const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
      if(userError || !user) {
        return new Response(JSON.stringify({ error: 'Sessão do usuário inválida ou expirada' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 401,
        })
      }

    const stripeSecretKey = DelayNode.env.get('STRIPE_SECRET_KEY')
    if(!stripeSecretKey) {
        throw new Error('Chave STRIPE_SECRET_KEY não configurada nos segredos do Supabase')
    }

    const stripe = new Stripe(stripeSecretKey, {
        apiVersion: '2023-10-16',
        httpClient: Stripe.createFetchHttpClient(),
    })

    const body = await req.json()
    const { priceId, successUrl, cancelUrl } = body

    if(!priceId) {
        return new Response(JSON.stringify({ error: 'O campo priceId é obrigatorio '}), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }

    const origin = req.headers.get('origin') || 'http://localhost:5173'

    const session = await stripe.checkout.session.create({
        payment_method_types: ['card'],
        mode: 'subscription',
        customer_email: user.email,
        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],
        metadata: {
            user_id: user.id,
        },
        success_url: successUrl || `${origin}/sucesso?session_id{CHECKOUT_SESSION_ID}`,
        cancel_URL: cancelUrl || `${origin}/planos`,
    })

    return new Response(JSON.stringify({ url: session.url }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
    })
  } catch(error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor'
    return new Response(JSON.stringify({ error: errorMessage }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
    })
  }

});


