import { supabase } from "./supabase";
import type { ProcedureData } from "@/form-config/types";

export interface ProcedureDbRow extends ProcedureData {
    id_prodecimento: string;
    created_at?: string;
}

export interface ProcedureDbUpdate {
    name?: string;
    description?: string;
    price?: number;
    duration?: string;
    id_categoria?: string;
}

export const procedureService = {
    async createProcedure(data: ProcedureData): Promise<ProcedureDbRow> {
        const { data: response, error } = await supabase.from("Procedimento").insert({
            name: data.name,
            description: data.description,
            price: data.price,
            duration: data.duration,
            id_categoria: data.category
        }).select("id_prodecimento, name, description, price, duration, category: id_categoria, created_at").single();

        if (error) throw error;
        if (!response) throw new Error("Nenhum dado retornado ao cadastrar o procedimento");
        return response as ProcedureDbRow;
    },

    async listProcedures(): Promise<ProcedureDbRow[]> {
        const { data, error } = await supabase.from("Procedimento")
            .select("id_prodecimento, name, description, price, duration, category: id_categoria, created_at")
            .order("name", { ascending: true });
        
        if (error) throw error;
        return (data || []) as ProcedureDbRow[];
    },

    async updateProcedure(id_prodecimento: string, data: Partial<ProcedureData>): Promise<void> {
        const updateData: ProcedureDbUpdate = {};
        if (data.name !== undefined) updateData.name = data.name;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.price !== undefined) updateData.price = data.price;
        if (data.duration !== undefined) updateData.duration = data.duration;
        if (data.category !== undefined) updateData.id_categoria = data.category;

        const { error } = await supabase.from("Procedimento").update(updateData).eq("id_prodecimento", id_prodecimento);

        if (error) throw error;
    },

    async deleteProcedure(procedure_id: string): Promise<void> {
        const { error } = await supabase.from("Procedimento").delete().eq("id_prodecimento", procedure_id);

        if (error) throw error;
    }
};