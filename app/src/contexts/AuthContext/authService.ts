import { supabase } from "@/services/supabase";
import type { User } from "@supabase/supabase-js";

export const authService = {
    async getCurrentSession() {
        const { data: { session } } = await supabase.auth.getSession();
        return session?.user ?? null;
    },

    onAuthStateChange(callback: (user: User | null) => void) {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            callback(session?.user ?? null);
        });
        return subscription;
    },

    async signUp(email: string, password: string) {
        return await supabase.auth.signUp({ email, password });
    },

    async signIn(email: string, password: string) {
        return await supabase.auth.signInWithPassword({ email, password });
    },

    async signOut() {
        return await supabase.auth.signOut();
    },

    async resetPassword(email: string) {
        return await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });
    }
};