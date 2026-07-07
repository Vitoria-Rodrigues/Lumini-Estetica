import { createContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { authService } from "./authService";
import type { AuthContextProps, AuthProviderProps } from "./types";

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        authService.getCurrentSession().then((currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        const subscription = authService.onAuthStateChange((currentUser) => {
            setUser(currentUser);
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