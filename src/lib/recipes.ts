import supabase from "./supabaseClient";

// Database row shape for the `recipes` table
export type DbRecipe = {
    id: number;
    created_at: string | null;
    title: string;
    image_path: string | null;
    cook_time: string | null;
    prep_time: string | null;
    ingredients: string[] | null;
    instructions: string | null;
    is_published: boolean | null;
    owner_id: string | null; // uuid
    updated_at: string | null;
};

// UI-friendly shape used by components
export type UIRecipe = {
    id: string;
    title: string;
    imageUrl: string;
    prepTime: string;
    cookTime: string;
    ingredients: string[];
    instructions: string;
};

const BUCKET = "recipes-images";

function toPublicImageUrl(path: string | null | undefined): string {
    if (!path) return "";
    try {
        const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
        return data?.publicUrl || "";
    } catch {
        return "";
    }
}

export async function fetchPublishedRecipes(): Promise<UIRecipe[]> {
    const { data, error } = await supabase
        .from("recipes")
        .select(
            "id, title, image_path, cook_time, prep_time, ingredients, instructions, is_published, created_at"
        )
        .eq("is_published", true)
        .order("created_at", { ascending: true });

    if (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load recipes:", error);
        return [];
    }

    const rows = (data || []) as unknown as DbRecipe[];
    return rows.map((r) => ({
        id: String(r.id),
        title: r.title,
        imageUrl: toPublicImageUrl(r.image_path),
        prepTime: r.prep_time || "",
        cookTime: r.cook_time || "",
        ingredients: Array.isArray(r.ingredients) ? r.ingredients : [],
        instructions: r.instructions || "",
    }));
}
