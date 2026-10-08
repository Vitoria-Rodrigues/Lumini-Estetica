import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import Stripe from "https://esm.sh/stripe@14.25.0?target=deno"

serve(async (req: Request): Promise<Response> => {
    try{
        const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
        const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')

        if(!stripeSecretKey || !webhookSecret){
            return new Response('Configuração ausente: STRIPE_SECRET_KEY ou STRIPE_WEBHOOK_SECRET', {
                status: 500
            })
        }

        const stripe = new Stripe(stripeSecretKey, {
            apiVersion: '2023-10-16',
            httpClient: Stripe.createFetchHttpClient(),
        })

        const signature = req.headers.get('stripe-signature')
        if(!signature) {
            return new Response('Cabeçalho stripe-signature ausente', {
                status: 400
            })
        }

        const body = await req.text()
        let event: Stripe.Event

        try{
            event = await stripe.webhooks
            .constructEventAsync(body, signature, webhookSecret)
        } catch(error: any) {
            console.error(`[Webhook Error] Assinatura inválida: ${error.message}`)
            return new Response(`Erro de Assinatura: ${error.message}`, {
                status: 400
            })
        }

        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        switch(event.type) {
            case 'payment_intent.succeeded': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent
                const idConsulta = paymentIntent.metadata?.id_consulta

                console.log(`[Webhook] Pagamento confirmado para consulta ID: ${idConsulta}`)

                if (idConsulta) {
                    const { error } = await supabaseAdmin
                        .from('consulta')
                        .update({
                            status_pagamento: 'Pago',
                            edited_at: new Date().toISOString(),
                        })
                        .eq('id_consulta', idConsulta)

                    if (error) {
                        console.error('[Webhook] Erro ao atualizar status de pagamento no Supabase:', error)
                    }
                }
                break
            }

            case 'payment_intent.processing': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent
                const idConsulta = paymentIntent.metadata?.id_consulta

                console.log(`[Webhook] Pagamento em processamento para consulta ID: ${idConsulta}`)

                if (idConsulta) {
                    const { error } = await supabaseAdmin
                        .from('consulta')
                        .update({
                            status_pagamento: 'Processando',
                            edited_at: new Date().toISOString(),
                        })
                        .eq('id_consulta', idConsulta)
                        .neq('status_pagamento', 'Pago')

                    if (error) {
                        console.error('[Webhook] Erro ao atualizar processamento no Supabase:', error)
                    }
                }
                break
            }

            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent
                const idConsulta = paymentIntent.metadata?.id_consulta

                console.log(`[Webhook] Pagamento falhou para consulta ID: ${idConsulta}`)

                if (idConsulta) {
                    const { error } = await supabaseAdmin
                        .from('consulta')
                        .update({
                            status_pagamento: 'Recusado',
                            edited_at: new Date().toISOString(),
                        })
                        .eq('id_consulta', idConsulta)

                    if (error) {
                        console.error('[Webhook] Erro ao atualizar falha de pagamento no Supabase:', error)
                    }
                }
                break
            }

            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session
                const userId = session.metadata?.user_id
                const stripeCustomerId = session.customer as string
                const subscriptionId = session.subscription as string

                console.log(`[Webhook] Pagamento concluído para usuário ID: ${userId}`)

                if(userId) {
                    const { error } = await supabaseAdmin
                    .from('subscriptions')
                    .upsert({
                        user_id: userId,
                        stripe_customer_id: stripeCustomerId,
                        stripe_subscription_id: subscriptionId,
                        status: 'active',
                        updated_at: new Date().toISOString(),
                    }, { onConflict: 'user_id' })

                    if(error) {
                        console.error('[Webhook] Erro ao salvar assinatura no Supabase:', error)
                    }
                }
                break
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription
                console.log(`[Webhook] Assinatura cancelada: ${subscription.id}`)

                await supabaseAdmin.from('subscriptions')
                .update({ status: 'canceled', updated_at: new Date().toISOString() }).eq('stripe_subscription_id', subscription.id)
                break 
            }

            default: 
            console.log(`[Webhook] Evento não processado: ${event.type}`)
        }

        return new Response(JSON.stringify({ received: true }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch( error: any) {
        console.error(`[Webhook Exception]: ${error.message}`)
        return new Response(`Erro no servidor: ${error.message}`, {
            status: 500
        })
    }
})