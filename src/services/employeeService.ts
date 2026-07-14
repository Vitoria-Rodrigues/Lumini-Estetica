import { supabase } from "@/services/supabase";
import type { EmployeeData } from "@/form-config/types";

export type AppRole = "admin" | "recepcionista" | "esteticista" | "massagista" | "depiladora";

export const employeeService = {
    async createEmployee(data: EmployeeData) {
        const {data: authData, error: authError} = await supabase.auth.admin.createUser({
            email: data.email,
            password: data.password,
            email_confirm: true,
            user_metadata: {
                app_role: data.role,
            },
        });

        if(authError) throw authError;

        const userId = authData.user.id;

        const {error: profileError} = await supabase.from("Funcionario").update({
            name: data.name,
            cpf: data.cpf,
            phone: data.phone ?? null,
            specialty: data.specialty,
            salary: data.salary ?? null,
        }).eq("user_id", userId);

        if(profileError) throw profileError;
    },

    async listEmployees(){
        const { data, error } = await supabase.from("Funcionario").select("*");

        if(error) throw error;

        return data;
    },

    async deletEmployee(userId: string) {
        const { error } = await supabase.from("Funcionario").delete().eq("user_id", userId);

        if(error) throw error;
    },

    async getMyProfile(){
        const { data, error } = await supabase.from("Funcionario").select("*").single();

        if(error) throw error;

        return data;
    }
}