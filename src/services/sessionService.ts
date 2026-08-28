import { supabase } from "./supabase";

export type SessionStatus = 'Pendente' | 'Realizada' | 'Cancelada';

export interface SessionData{
    id_cliente: string;
    id_funcionario: string;
    id_procedimento: string;
    data: string;
    horario: string;
    observacoes?: string;
    valor_cobrado: number;
    status?: SessionStatus;
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

    Cliente?: { name: string, cpf: string } | null;
    Funcionario?: { name: string } | null;
    Procedimento?: { name: string; price: number } | null;
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
  Cliente(name),
  Funcionario(name),
  Procedimento(name, price)
`;

export const sessionService = {
    async createSession(data: SessionData): Promise<SessionDbRow> {
        const { data: response, error } = await supabase.from("Consulta").insert({
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
            .from("Consulta")
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
        
        const { error } = await supabase.from("Consulta").update(updateData).eq("id_consulta", id_consulta);

        if(error) throw error;
    },

    async deleteSession(id_consulta: string): Promise<void> {
        const { error } = await supabase
            .from("Consulta")
            .update({deleted_at: new Date().toISOString()})
            .eq("id_consulta", id_consulta);

        if (error) throw error;
    },

    async getTodaySession(): Promise<SessionDbRow[]> {
        const todayStr = new Date().toISOString().split("T")[0];

        const { data, error } = await supabase
        .from("Consulta")
        .select(SESSION_SELECT_FIELDS)
        .eq("data", todayStr)
        .is("deleted_at", null)
        .order("horario", {ascending: true});

        if(error) throw error;
        return (data || []) as unknown as SessionDbRow[];
    }
}

