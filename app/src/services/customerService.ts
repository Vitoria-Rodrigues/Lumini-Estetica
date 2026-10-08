import { supabase } from "./supabase";
import type { CustomerData } from "@/form-config/types";

export interface CustomerDbRow extends CustomerData {
    id_cliente: string;
    birthdate?: string; 
    created_at?: string;
    edited_at?: string | null;
    deleted_at?: string | null;
}

export interface CustomerDbUpdate {
    name?: string;
    cpf?: string;
    phone?: string;
    birthdate?: string;   
    edited_at?: string;
    deleted_at?: string | null;
}

export const customerService = {
    async createCustomer(data: CustomerData): Promise<CustomerDbRow> {
        const { data: response, error } = await supabase.from("cliente").insert({
            name: data.name,
            cpf: data.cpf,
            phone: data.phone,
            birthdate: data.birthdate || null,
        }).select().single();

        if (error) throw error;
        if (!response) throw new Error("Nenhum dado retornado ao cadastrar o cliente");
        return response as CustomerDbRow;
    },

    async listCustomers(): Promise<CustomerDbRow[]> {
        const { data, error } = await supabase.from("cliente")
        .select("*").is("deleted_at", null).order("name", { ascending: true });

        if (error) throw error;
        return (data || []) as CustomerDbRow[];
    },

    async updateCustomer(id_cliente: string, data: Partial<CustomerData>): Promise<void> {
        const updateData: CustomerDbUpdate = {
            edited_at: new Date().toISOString()
        };
        if (data.name !== undefined) updateData.name = data.name;
        if (data.cpf !== undefined) updateData.cpf = data.cpf;
        if (data.phone !== undefined) updateData.phone = data.phone;
        if (data.birthdate !== undefined) updateData.birthdate = data.birthdate;  

        const { error } = await supabase.from("cliente").update(updateData).eq("id_cliente", id_cliente);

        if (error) throw error;
    },

    async deleteCustomer(id_cliente: string): Promise<void> {
        const { error } = await supabase.from("cliente")
        .update({deleted_at: new Date().toISOString() })
        .eq("id_cliente", id_cliente);

        if (error) throw error;
    }
};

