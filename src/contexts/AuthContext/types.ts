import type { ReactNode } from "react";
import type { User, AuthError, AuthResponse } from "@supabase/supabase-js";

export interface AuthContextProps {
    user: User | null;
    loading: boolean;
    signUp: (email: string, password: string) => Promise<{ data: AuthResponse['data']; error: AuthError | null }>;
    signIn: (email: string, password: string) => Promise<{ data: AuthResponse['data']; error: AuthError | null }>;
    signOut: () => Promise<{ error: AuthError | null }>;
    resetPassword: (email: string) => Promise<{ data: object | null; error: AuthError | null }>;
}

export interface AuthProviderProps {
    children: ReactNode;
}