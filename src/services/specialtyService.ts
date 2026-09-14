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
        .from("Especialidade")
        .select("*")
        .order("nome", { ascending: true });

        if(error) throw error;
        return (data || []) as SpecialtyDbRow[];
    },
};