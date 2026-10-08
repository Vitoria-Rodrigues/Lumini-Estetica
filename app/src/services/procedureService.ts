import { supabase } from "./supabase";
import type { ProcedureData } from "@/form-config/types";

export interface ProcedureDbRow extends ProcedureData {
    id_procedimento: string;
    id_especialidade?: number | null;
    created_at?: string;
    edited_at?: string | null;
    deleted_at?: string | null;
}

export interface ProcedureDbUpdate {
    name?: string;
    description?: string;
    price?: number;
    duration?: string;
    id_categoria?: string;
    id_especialidade?: number | null;
    edited_at?: string;
    deleted_at?: string | null;
}

export const procedureService = {
    async createProcedure(data: ProcedureData): Promise<ProcedureDbRow> {
        const { data: response, error } = await supabase.from("procedimento").insert({
            name: data.name,
            description: data.description,
            price: data.price,
            duration: data.duration,
            id_categoria: data.category,
            id_especialidade: data.specialtyId ? Number(data.specialtyId) : null,
        }).select("id_procedimento, name, description, price, duration, category: id_categoria, id_especialidade, created_at").single();

        if (error) throw error;
        if (!response) throw new Error("Nenhum dado retornado ao cadastrar o procedimento");
        return response as ProcedureDbRow;
    },

    async listProcedures(): Promise<ProcedureDbRow[]> {
        const { data, error } = await supabase.from("procedimento")
            .select("id_procedimento, name, description, price, duration, category: id_categoria, id_especialidade")
            .is("deleted_at", null)
            .order("name", { ascending: true });
        
        if (error) throw error;
        return (data || []) as ProcedureDbRow[];
    },

    async updateProcedure(id_procedimento: string, data: Partial<ProcedureData>): Promise<void> {
        const updateData: ProcedureDbUpdate = {
            edited_at: new Date().toISOString()
        };
        if (data.name !== undefined) updateData.name = data.name;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.price !== undefined) updateData.price = data.price;
        if (data.duration !== undefined) updateData.duration = data.duration;
        if (data.category !== undefined) updateData.id_categoria = data.category;
        if (data.specialtyId !== undefined) updateData.id_especialidade = data.specialtyId ? Number(data.specialtyId) : null;

        const { error } = await supabase.from("procedimento").update(updateData).eq("id_procedimento", id_procedimento);

        if (error) throw error;
    },

    async deleteProcedure(procedure_id: string): Promise<void> {
        const { error } = await supabase.from("procedimento")
        .update({deleted_at: new Date().toISOString()})
        .eq("id_procedimento", procedure_id);

        if (error) throw error;
    }
};