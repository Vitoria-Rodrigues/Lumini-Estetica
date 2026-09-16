import { supabase } from "./supabase";

export interface SpecialtyDbRow{
    id_especialidade: number;
    nome: string;
    descricao?: string | null;
    created_at?: string;
}

export const specialtyService = {
    async listSpecialties(): Promise<SpecialtyDbRow[]> {
        const { data, error } = await supabase
        .from("especialidade")
        .select("*")
        .order("nome", { ascending: true });

        if(error) throw error;
        return (data || []) as SpecialtyDbRow[];
    },

    async createSpecialty(nome: string): Promise<SpecialtyDbRow> {
        const { data, error } = await supabase
        .from("especialidade")
        .insert({ nome })
        .select()
        .single();

        if (error) throw error;
        return data as SpecialtyDbRow;
    }
};