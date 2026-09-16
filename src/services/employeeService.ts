import { supabase } from "@/services/supabase";
import type { EmployeeData } from "@/form-config/types";
import { FunctionsHttpError } from "@supabase/supabase-js";

export type AppRole = "admin" | "recepcionista" | "esteticista" | "massagista" | "depiladora";

export interface EmployeeDbRow {
  id_funcionario: number;
  user_id: string;
  name: string;
  app_role: AppRole;
  edited_at?: string | null;  
  deleted_at?: string | null;
  especialidades?: { id_especialidade: number }[];
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

        // Sincroniza a especialidade na tabela relacional usando o userId criado
        if (response && response.userId && data.specialtyId) {
            const { data: funcData } = await supabase.from("funcionario")
                .select("id_funcionario")
                .eq("user_id", response.userId)
                .single();
            
            if (funcData) {
                await this.syncEmployeeSpecialties(funcData.id_funcionario, data.specialtyId);
            }
        }

        return response;
    },

    async listEmployees(): Promise<EmployeeDbRow[]>{
        const { data, error } = await supabase.from("funcionario")
        .select("*, funcionario_especialidade(id_especialidade)").is("deleted_at", null)
        .order("name", { ascending: true });

        if(error) throw error;

        return (data || []) as EmployeeDbRow[];
    },

    async syncEmployeeSpecialties(idFuncionario: number, specialtyId: string | number){
        if(!idFuncionario) return;

        await supabase.from("funcionario_especialidade").delete().eq("id_funcionario", idFuncionario);

        if (specialtyId) {
            await supabase.from("funcionario_especialidade").insert({
                id_funcionario: idFuncionario,
                id_especialidade: Number(specialtyId)
            });
        }
    },

    async updateEmployee(userId: string, data: Partial<EmployeeData>){
        const { data: funcData, error } = await supabase.from("funcionario")
        .update({
            name:data.name,
            cpf: data.cpf,
            phone: data.phone ?? null,
            salary: data.salary ?? null,
            specialty: data.specialty,
            app_role: data.role,
            edited_at: new Date().toISOString()
        })
        .eq("user_id", userId)
        .select("id_funcionario")
        .single();

        if(error) throw error;

        // Sincroniza a especialidade após atualizar
        if (funcData) {
            await this.syncEmployeeSpecialties(funcData.id_funcionario, data.specialtyId || "");
        }
    },

    async deletEmployee(userId: string) {
        const { error } = await supabase.from("funcionario")
        .update({deleted_at: new Date().toISOString()})
        .eq("user_id", userId);

        if(error) throw error;
    },

    async getMyProfile(){
        const { data, error } = await supabase.from("funcionario")
        .select("*").single();

        if(error) throw error;

        return data;
    }
}