"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Category } from "@/types";

interface Props {
  categories: Pick<Category, "id" | "name" | "slug">[];
  activeCategory: string;
  activeSort: string;
}

export function ShopFilters({ categories, activeCategory, activeSort }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function navigate(key: string, value: string) {
    const p = new URLSearchParams(searchParams.toString());
    if (value) p.set(key, value);
    else p.delete(key);
    if (key === "category") p.delete("q");
    router.push(`/shop?${p.toString()}`);
  }

  return (
    <div className="space-y-7">
      {/* Category filter */}
      <div>
        <h3 className="text-xs font-semibold tracking-widest uppercase text-brand-muted mb-3">
          Category
        </h3>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => navigate("category", "")}
              className={`text-sm transition-colors ${
                activeCategory === ""
                  ? "text-brand-terracotta font-semibold"
                  : "text-brand-charcoal hover:text-brand-terracotta"
              }`}
            >
              All Collections
            </button>
          </li>
          {categories.map((c) => (
            <li key={c.id}>
              <button
                onClick={() => navigate("category", c.slug)}
                className={`text-sm transition-colors ${
                  activeCategory === c.slug
                    ? "text-brand-terracotta font-semibold"
                    : "text-brand-charcoal hover:text-brand-terracotta"
                }`}
              >
                {c.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Sort */}
      <div>
        <h3 className="text-xs font-semibold tracking-widest uppercase text-brand-muted mb-3">
          Sort By
        </h3>
        <ul className="space-y-2">
          {[
            { value: "newest", label: "Newest First" },
            { value: "price_asc", label: "Price: Low to High" },
            { value: "price_desc", label: "Price: High to Low" },
          ].map((s) => (
            <li key={s.value}>
              <button
                onClick={() => navigate("sort", s.value)}
                className={`text-sm transition-colors ${
                  activeSort === s.value
                    ? "text-brand-terracotta font-semibold"
                    : "text-brand-charcoal hover:text-brand-terracotta"
                }`}
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
