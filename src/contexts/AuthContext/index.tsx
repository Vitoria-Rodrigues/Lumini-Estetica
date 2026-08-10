import { createContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/services/supabase";
import { authService } from "./authService";
import type { AuthContextProps, AuthProviderProps, CustomUser } from "./types";

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<CustomUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchUserProfile = async (supabaseUser: User | null): Promise<CustomUser | null> => {
        if (!supabaseUser) return null;
        
        try {
            console.log("[AuthContext] Supabase Auth User details:", {
                id: supabaseUser.id,
                email: supabaseUser.email,
                user_metadata: supabaseUser.user_metadata
            });

            const { data: employee, error } = await supabase
                .from("Funcionario")
                .select("name, app_role")
                .eq("user_id", supabaseUser.id)
                .maybeSingle();

            if (error) {
                console.error("[AuthContext] Erro ao buscar perfil do funcionário da tabela Funcionario:", error);
            } else {
                console.log("[AuthContext] Perfil do funcionário retornado da tabela Funcionario:", employee);
            }
            
            const name = employee?.name || supabaseUser.user_metadata?.name || supabaseUser.user_metadata?.full_name || supabaseUser.email || "Usuário";
            const role = employee?.app_role || supabaseUser.user_metadata?.app_role || supabaseUser.user_metadata?.role || "Cargo não informado";

            return {
                ...supabaseUser,
                name,
                role
            };
        } catch (err) {
            console.error("[AuthContext] Erro inesperado ao buscar perfil do funcionário:", err);
            return supabaseUser;
        }
    };

    useEffect(() => {
        authService.getCurrentSession().then(async (currentUser) => {
            const enrichedUser = await fetchUserProfile(currentUser);
            setUser(enrichedUser);
            setLoading(false);
        });

        const subscription = authService.onAuthStateChange(async (currentUser) => {
            const enrichedUser = await fetchUserProfile(currentUser);
            setUser(enrichedUser);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const value: AuthContextProps = {
        user,
        loading,
        signUp: authService.signUp,
        signIn: authService.signIn,
        signOut: async () => {
            const res = await authService.signOut();
            if (!res.error) setUser(null);
            return res;
        },
        resetPassword: authService.resetPassword,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};