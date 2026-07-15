import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface CreateEmployeeRequestBody {
  email?: string;
  password?: string;
  role?: string;
  name?: string;
  cpf?: string;
  phone?: string;
  specialty?: string;
  salary?: number;
}

interface FuncionarioProfile {
  app_role: string;
}

serve(async (req: Request): Promise<Response> => {
  // Trata requisições de preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Nenhum cabeçalho de autorização fornecido' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    // 1. Instancia cliente para verificar a sessão do usuário que chama a função
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    // Obtém o usuário logado a partir do token JWT
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Sessão inválida ou expirada' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    // 2. Consulta no banco se este usuário logado possui cargo de admin
    const { data: profile, error: profileCheckError } = await supabaseClient
      .from('Funcionario')
      .select('app_role')
      .eq('user_id', user.id)
      .single()

    if (profileCheckError || !profile || (profile as unknown as FuncionarioProfile).app_role !== 'admin') {
      return new Response(JSON.stringify({ 
        error: 'Acesso negado: Apenas administradores podem cadastrar profissionais',
        debug: {
          logged_in_user_id: user.id,
          profile_found: profile ?? null,
          database_error: profileCheckError ? profileCheckError.message : null
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403,
      })
    }

    // 3. Cria cliente administrativo (com privilégios de service_role)
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        }
      }
    )

    const body = (await req.json()) as CreateEmployeeRequestBody
    const { email, password, role, name, cpf, phone, specialty, salary } = body

    if (!email || !password || !name) {
      return new Response(JSON.stringify({ error: 'Campos obrigatórios ausentes (email, senha ou nome)' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // 4. Cria o usuário com a role no Auth Metadata
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { app_role: role }
    })

    if (authError || !authData.user) {
      throw authError || new Error("Erro ao criar usuário no Auth")
    }

    // 5. Atualiza ou insere os dados cadastrais na tabela Funcionario
    // Usamos upsert para evitar falhas caso o trigger automático do banco não tenha sido executado ainda ou não exista
    const { error: updateError } = await adminClient
      .from('Funcionario')
      .upsert({
        user_id: authData.user.id,
        name,
        cpf,
        phone: phone ?? null,
        specialty,
        salary: salary ?? null,
        app_role: role
      }, { onConflict: 'user_id' })

    if (updateError) throw updateError

    return new Response(JSON.stringify({ success: true, userId: authData.user.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor';
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
