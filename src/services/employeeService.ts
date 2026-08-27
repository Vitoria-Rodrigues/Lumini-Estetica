import { supabase } from "@/services/supabase";
import type { EmployeeData } from "@/form-config/types";
import { FunctionsHttpError } from "@supabase/supabase-js";

export type AppRole = "admin" | "recepcionista" | "esteticista" | "massagista" | "depiladora";

export interface EmployeeDbRow {
  id_funcionario: number;
  user_id: string;
  name: string;
  edited_at?: string | null;  
  deleted_at?: string | null;
}

export const employeeService = {
    async createEmployee(data: EmployeeData) {
        const { data: response, error } = await supabase.functions
        .invoke("create-employee", {
            body: data,
        });

        if (error) {
            if (error instanceof FunctionsHttpError) {
                try {
                    const errorJson = await error.context.json();
                    console.error("[Edge Function Error Details]:", errorJson);
                    throw new Error(errorJson.error || errorJson.message || "Erro interno da Edge Function");
                } catch (parseError) {
                    if (parseError instanceof Error && parseError.message !== "Erro interno da Edge Function") {
                        throw parseError;
                    }
                }
            }
            throw error;
        }

        if (response && response.error) {
            throw new Error(response.error);
        }

        return response;
    },

    async listEmployees(): Promise<EmployeeDbRow[]>{
        const { data, error } = await supabase.from("Funcionario")
        .select("*").is("deleted_at", null)
        .order("name", { ascending: true });

        if(error) throw error;

        return (data || []) as EmployeeDbRow[];
    },

    async updateEmployee(userId: string, data: Partial<EmployeeData>){
        const { error } = await supabase.from("Funcionario")
        .update({
            name:data.name,
            cpf: data.cpf,
            phone: data.phone ?? null,
            salary: data.salary ?? null,
            specialty: data.specialty,
            app_role: data.role,
            edited_at: new Date().toISOString()
        }).eq("user_id", userId);

        if(error) throw error;
    },

    async deletEmployee(userId: string) {
        const { error } = await supabase.from("Funcionario")
        .update({deleted_at: new Date().toISOString})
        .eq("user_id", userId);

        if(error) throw error;
    },

    async getMyProfile(){
        const { data, error } = await supabase.from("Funcionario")
        .select("*").single();

        if(error) throw error;

        return data;
    }
}