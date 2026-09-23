import { supabase } from "./supabase";

export type SessionStatus = 'Pendente' | 'Realizada' | 'Cancelada';

export type PaymentStatus = 'Pendente' | 'Processando' | 'Pago' | 'Recusado';

export interface SessionData{
    id_cliente: string;
    id_funcionario: string;
    id_procedimento: string;
    data: string;
    horario: string;
    observacoes?: string;
    valor_cobrado: number;
    status?: SessionStatus;
    status_pagamento?: PaymentStatus;
    edited_at?: string | null;
    deleted_at?: string | null;
}

export interface SessionDbRow{
    id_consulta: string;
    id_cliente: string;
    id_funcionario: string;
    id_procedimento: string;
    data: string;
    horario: string;
    observacoes: string | null;
    created_at?: string;
    edited_at?: string | null;
    deleted_at?: string | null;
    valor_cobrado: number;
    status: SessionStatus;
    status_pagamento: PaymentStatus;

    cliente?: { name: string, cpf: string } | null;
    funcionario?: { name: string } | null;
    procedimento?: { name: string; price: number } | null;
}

export interface SessionDbUpdate{
    id_cliente?: string;
    id_funcionario?: string;
    id_procedimento?: string;
    data?: string;
    horario?: string;
    observacoes?: string;
    valor_cobrado?: number;
    status?: SessionStatus;
    status_pagamento?: PaymentStatus;
    edited_at?: string;
    deleted_at?: string | null;
}

const SESSION_SELECT_FIELDS = `
  id_consulta,
  id_cliente,
  id_funcionario,
  id_procedimento,
  data,
  horario,
  observacoes,
  valor_cobrado,
  created_at,
  edited_at,
  deleted_at,
  status,
  status_pagamento,
  cliente(name, cpf),
  funcionario(name),
  procedimento(name, price)
`;

export const sessionService = {
    async createSession(data: SessionData): Promise<SessionDbRow> {
        const { data: response, error } = await supabase.from("consulta").insert({
            id_cliente: data.id_cliente,
            id_funcionario: data.id_funcionario,
            id_procedimento: data.id_procedimento,
            data: data.data,
            horario: data.horario,
            observacoes: data.observacoes,
            valor_cobrado: data.valor_cobrado
        }).select(SESSION_SELECT_FIELDS).single();

        if (error) throw error;
        if (!response) throw new Error("Nenhum dado retornado ao agendar a consulta");
        return response as unknown as SessionDbRow;
    },

    async listSessions(): Promise<SessionDbRow[]> {
        const { data, error } = await supabase
            .from("consulta")
            .select(SESSION_SELECT_FIELDS)
            .is("deleted_at", null)
            .order("data", { ascending: true })
            .order("horario", { ascending: true });

        if (error) throw error;
        return (data || []) as unknown as SessionDbRow[];
    },

    async updateSession (id_consulta: string, data: Partial<SessionData>): Promise<void> {
        const updateData: SessionDbUpdate = {
            edited_at: new Date().toISOString()
        };
        if (data.id_cliente !== undefined) updateData.id_cliente = data.id_cliente;
        if (data.id_funcionario !== undefined) updateData.id_funcionario = data.id_funcionario;
        if (data.id_procedimento !== undefined) updateData.id_procedimento = data.id_procedimento;
        if (data.data !== undefined) updateData.data = data.data;
        if (data.horario !== undefined) updateData.horario = data.horario;
        if (data.observacoes !== undefined) updateData.observacoes = data.observacoes;
        if (data.valor_cobrado !== undefined) updateData.valor_cobrado = data.valor_cobrado;
        if (data.status !== undefined) updateData.status = data.status;
        if(data.status_pagamento !== undefined) updateData.status_pagamento = data.status_pagamento;
        
        const { error } = await supabase.from("consulta").update(updateData).eq("id_consulta", id_consulta);

        if(error) throw error;
    },

    async deleteSession(id_consulta: string): Promise<void> {
        const { error } = await supabase
            .from("consulta")
            .update({deleted_at: new Date().toISOString()})
            .eq("id_consulta", id_consulta);

        if (error) throw error;
    },

    async createMultiple(data: SessionData[]): Promise<SessionDbRow[]> {
        if(!data || data.length === 0){
            return[];
        }

        const payload = data.map((item) => ({
            id_cliente: item.id_cliente,
            id_funcionario: item.id_funcionario,
            id_procedimento: item.id_procedimento,
            data: item.data,
            horario: item.horario,
            observacoes: item.observacoes || null,
            valor_cobrado: item.valor_cobrado,
            status: item.status || "Pendente",
            status_pagamento: item.status_pagamento || "Pendente", 
        }));

        const { data: response, error } = await 
        supabase.from("consulta")
        .insert(payload)
        .select(SESSION_SELECT_FIELDS);

        if(error){
            console.error("[sessionService.createMultiple] Erro ao inserir consultas:", error);
            throw error;
        }

        if(!response) {
            throw new Error("Nenhum dado retornado ao agendar as consultas.");
        }

        return response as unknown as SessionDbRow[];
    },

    async getTodaySession(): Promise<SessionDbRow[]> {
        const todayStr = new Date().toISOString().split("T")[0];

        const { data, error } = await supabase
        .from("consulta")
        .select(SESSION_SELECT_FIELDS)
        .eq("data", todayStr)
        .is("deleted_at", null)
        .order("horario", {ascending: true});

        if(error) throw error;
        return (data || []) as unknown as SessionDbRow[];
    },

    async getMonthlyStats(year: number, monthZeroIndexed: number) {
        const startDate = new Date(year, monthZeroIndexed, 1).toISOString().split("T")[0];
        const endDate = new Date(year, monthZeroIndexed + 1, 0).toISOString().split("T")[0];

        const [realizadosRes, vendaRes] = await Promise.all([
            supabase.from("consulta")
            .select("*", { count: "exact", head: true})
            .gte("data", startDate)
            .lte("data", endDate)
            .eq("status", "Realizada")
            .is("deleted_at", null),

            supabase.from("consulta")
            .select("*", { count: "exact", head: true})
            .gte("data", startDate)
            .lte("data", endDate)
            .eq("status_pagamento", "Pago")
            .is("deleted_at", null),
        ]);

        return{
            realizadosMes: realizadosRes.count || 0,
            vendasMes: vendaRes.count || 0,
        }
    },

    async getRecentSessions(limit = 10): Promise<SessionDbRow[]> {
        const { data, error } = await supabase.from("consulta")
        .select(SESSION_SELECT_FIELDS)
        .is("deleted_at", null)
        .order("data", { ascending: false })
        .order("horario", { ascending: false})
        .limit(limit);
        
        if(error) throw error;
        return (data || []) as unknown as SessionDbRow[];
    },

    async hasScheduleConflict(employeeId: string, date: string, time: string): Promise<boolean> {
        const { data, error } = await supabase.from("consulta")
        .select("id_consulta")
        .eq("id_funcionario", employeeId)
        .eq("data", date)
        .eq("horario", time)
        .neq("status", "Cancelada")
        .is("deleted_at", null)
        .limit(1);

        if(error) throw error;
        return Boolean(data && data.length > 0);
    },

}

