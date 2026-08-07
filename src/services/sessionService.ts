import { supabase } from "./supabase";

export interface SessionData{
    id_cliente: string;
    id_funcionario: string;
    id_procedimento: string;
    data: string;
    horario: string;
    observacoes?: string;
    valor_cobrado: number;
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
    valor_cobrado: number;

    Cliente?: { name: string };
    Funcionario?: { name: string };
    Procedimento?: { name: string; price: number };
}

export interface SessionDbUpdate{
    id_cliente?: string;
    id_funcionario?: string;
    id_procedimento?: string;
    data?: string;
    horario?: string;
    observacoes?: string;
    valor_cobrado?: number;
}

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
        }).select(`
            id_consulta,
            id_cliente,
            id_funcionario,
            id_procedimento,
            data,
            horario,
            observacoes,
            valor_cobrado,
            created_at,
            Cliente(name),
            Funcionario(name),
            Procedimento(name, price)
            `).single();

        if (error) throw error;
        if (!response) throw new Error("Nenhum dado retornado ao agendar a consulta");
        return response as unknown as SessionDbRow;
    },

    async listSessions(): Promise<SessionDbRow[]> {
        const { data, error } = await supabase
            .from("Consulta")
            .select(`
                id_consulta,
                id_cliente,
                id_funcionario,
                id_procedimento,
                data,
                horario,
                observacoes,
                valor_cobrado,
                created_at,
                Cliente(name),
                Funcionario(name),
                Procedimento(name, price)
            `)
            .order("data", { ascending: true })
            .order("horario", { ascending: true });

        if (error) throw error;
        return (data || []) as unknown as SessionDbRow[];
    },

    async updateSession (id_consulta: string, data: Partial<SessionData>): Promise<void> {
        const updateData: SessionDbUpdate = {};
        if (data.id_cliente !== undefined) updateData.id_cliente = data.id_cliente;
        if (data.id_funcionario !== undefined) updateData.id_funcionario = data.id_funcionario;
        if (data.id_procedimento !== undefined) updateData.id_procedimento = data.id_procedimento;
        if (data.data !== undefined) updateData.data = data.data;
        if (data.horario !== undefined) updateData.horario = data.horario;
        if (data.observacoes !== undefined) updateData.observacoes = data.observacoes;
        if (data.valor_cobrado !== undefined) updateData.valor_cobrado = data.valor_cobrado;

        const { error } = await supabase.from("Consulta").update(updateData).eq("id_consulta", id_consulta);

        if(error) throw error;
    },

    async deleteSession(id_consulta: string): Promise<void> {
        const { error } = await supabase
            .from("Consulta")
            .delete()
            .eq("id_consulta", id_consulta);

        if (error) throw error;
    }
}

