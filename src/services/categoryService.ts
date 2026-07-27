import { supabase } from "./supabase";

export interface categoryDbRow{
    id_category: string;
    descricao: string;
}

export const categoryService = {
    async listCategories(): Promise<categoryDbRow[]> {
        const { data, error } = await supabase
        .from("Categoria").
        select("id_category: id_categoria, descricao")
        .order("descricao",  {ascending: true});

        if(error) throw error;
        return (data || []) as categoryDbRow[];
    }
};

