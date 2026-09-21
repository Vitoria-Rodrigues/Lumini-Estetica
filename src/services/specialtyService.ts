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
    },

    async findOrCreateSpecialty(name: string): Promise<SpecialtyDbRow> {
        const trimmed = name.trim();
        if(!trimmed) throw new Error("Nome da especialidade é obrigatorio.");

        const { data: existing, error: searchError } = await supabase
        .from("especialidade")
        .select("*")
        .ilike("nome", trimmed)
        .maybeSingle();


        if(searchError) throw searchError;
        if(existing) return existing as SpecialtyDbRow;

        const { data: created, error: createdError } = await supabase
        .from("especialidade")
        .insert({ nome: trimmed})
        .select()
        .single();

        if(createdError) throw createdError;
        return created as SpecialtyDbRow;
    }, 

    async updateSpecialty(id_especialidade: number, newName: string): Promise<SpecialtyDbRow> {
        const trimmed = newName.trim();
        if(!trimmed) throw new Error("Nome da especialidade não pode ser vazio.");

        const { data, error } = await supabase
        .from("especialidade")
        .update({ nome: trimmed})
        .eq("id_especialidade", id_especialidade)
        .select()
        .single();

        if(error) throw error;
        return data as SpecialtyDbRow;
    }
};