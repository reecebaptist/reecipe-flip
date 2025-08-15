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

// Utility: generate a unique storage path for an image
function genImagePath(filename: string, ownerId?: string | null): string {
    const ext = (filename.split(".").pop() || "jpg").toLowerCase();
    const safeExt = ext.match(/^[a-z0-9]+$/) ? ext : "jpg";
    const ts = Date.now();
    const rand = Math.random().toString(36).slice(2, 8);
    const dir = ownerId ? `users/${ownerId}` : "public";
    return `${dir}/recipe-${ts}-${rand}.${safeExt}`;
}

export async function uploadRecipeImage(
    file: File,
    ownerId?: string | null
): Promise<{ path: string; publicUrl: string }> {
    // If no explicit owner provided, try to use the current authenticated user
    let resolvedOwner = ownerId ?? null;
    try {
        if (!resolvedOwner) {
            const { data } = await supabase.auth.getUser();
            resolvedOwner = data?.user?.id ?? null;
        }
    } catch {
        // ignore – will fallback to public folder
    }
    const path = genImagePath(file.name, resolvedOwner);
    const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, {
            contentType: file.type || "image/*",
            upsert: false,
        });
    if (error) throw error;
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return { path, publicUrl: data?.publicUrl || "" };
}

export type CreateRecipeInput = {
    title: string;
    prep_time?: string;
    cook_time?: string;
    ingredients?: string[];
    instructions?: string;
    image_path?: string | null;
    is_published?: boolean;
    owner_id?: string | null; // optional; will default to current user if available
};

export async function createRecipe(input: CreateRecipeInput) {
    // Resolve owner_id to the current authenticated user if not provided
    let ownerId: string | null | undefined = input.owner_id;
    if (!ownerId) {
        try {
            const { data } = await supabase.auth.getUser();
            ownerId = data?.user?.id ?? null;
        } catch {
            ownerId = null;
        }
    }

    const payload = {
        title: input.title,
        prep_time: input.prep_time ?? "",
        cook_time: input.cook_time ?? "",
        ingredients: input.ingredients ?? [],
        instructions: input.instructions ?? "",
        image_path: input.image_path ?? null,
        is_published: input.is_published ?? true,
        owner_id: ownerId ?? null,
    };
    const { data, error } = await supabase
        .from("recipes")
        .insert(payload)
        .select("*")
        .single();
    if (error) throw error;
    return data as DbRecipe;
}

    export type UpdateRecipeInput = {
        title?: string;
        prep_time?: string;
        cook_time?: string;
        ingredients?: string[];
        instructions?: string;
        image_path?: string | null;
        is_published?: boolean;
    };

    export async function updateRecipe(id: number, updates: UpdateRecipeInput) {
        // Get current image_path before applying update
        let previousImagePath: string | null = null;
        try {
            const { data: before } = await supabase
                .from("recipes")
                .select("image_path")
                .eq("id", id)
                .maybeSingle();
            previousImagePath = (before as any)?.image_path ?? null;
        } catch {
            // ignore; proceed without previous image cleanup
        }

        const { data, error } = await supabase
            .from("recipes")
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq("id", id)
            .select("*")
            .maybeSingle();
        if (error) throw error;
        if (!data) {
            throw new Error(
                "No matching recipe found or permission denied by RLS while updating."
            );
        }

        // If a new image path was provided (including null to clear) and it differs from the previous one,
        // attempt to delete the previous image from storage.
        if (typeof updates.image_path !== "undefined") {
            const newPath = updates.image_path ?? null;
            if (previousImagePath && previousImagePath !== newPath) {
                try {
                    await supabase.storage.from(BUCKET).remove([previousImagePath]);
                } catch {
                    // ignore storage cleanup errors
                }
            }
        }
        return data as DbRecipe;
    }

    export async function deleteRecipe(id: number) {
        // Try to delete associated image from storage if present
        const { data: row } = await supabase
            .from("recipes")
            .select("image_path")
            .eq("id", id)
            .maybeSingle();
        const imagePath: string | null = (row as any)?.image_path ?? null;
        const { error } = await supabase.from("recipes").delete().eq("id", id);
        if (error) throw error;
        if (imagePath) {
            try {
                await supabase.storage.from(BUCKET).remove([imagePath]);
            } catch {
                // ignore storage cleanup errors
            }
        }
    }
