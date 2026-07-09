import { createClient } from "@/lib/supabase/server";
import { categoryRank } from "./categories";

export type Tip = {
  id: string;
  title: string;
  body: string;
};

export type TipCategory = {
  category: string;
  tips: Tip[];
};

/** Tips globales agrupados por categoría, todo derivado de los datos. */
export async function loadTips(): Promise<TipCategory[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("global_tips")
    .select("id, category, title, body, sort_order")
    .order("sort_order");

  if (!data) return [];

  const byCategory = new Map<string, Tip[]>();
  for (const row of data) {
    const list = byCategory.get(row.category) ?? [];
    list.push({ id: row.id, title: row.title, body: row.body });
    byCategory.set(row.category, list);
  }

  return [...byCategory.entries()]
    .map(([category, tips]) => ({ category, tips }))
    .sort(
      (a, b) =>
        categoryRank(a.category) - categoryRank(b.category) ||
        a.category.localeCompare(b.category),
    );
}
