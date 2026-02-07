import React from "react";
import { Menu, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { publicService, PublicCategory, PublicSubCategory } from "../services/publicService";
import { getCategoryIcon } from "../utils/categoryIcons";

export function SecondHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [categories, setCategories] = useState<PublicCategory[]>([]);
  const [subCategoriesByCategory, setSubCategoriesByCategory] = useState<Record<number, PublicSubCategory[]>>({});
  const [loading, setLoading] = useState(true);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [cats, subCats] = await Promise.all([
          publicService.getCategories(true),
          publicService.getSubCategories(undefined, true),
        ]);
        if (cancelled) return;
        setCategories(cats);
        const byCategory: Record<number, PublicSubCategory[]> = {};
        subCats.forEach((sc) => {
          const cid = sc.category_id;
          if (!byCategory[cid]) byCategory[cid] = [];
          byCategory[cid].push(sc);
        });
        setSubCategoriesByCategory(byCategory);
      } catch (e) {
        if (!cancelled) console.error("Failed to load categories", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setActiveId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-blue-900 border-b-4 border-yellow-400 py-4">
        <div className="container mx-auto px-4 text-center text-white/80 text-sm">Loading categories...</div>
      </div>
    );
  }

  if (!categories.length) {
    return null;
  }

  return (
    <div ref={headerRef} className="w-full bg-blue-900 border-b-4 border-yellow-400">
      {/* ===== DESKTOP & TABLET ===== */}
      <div className="hidden md:flex flex-wrap justify-center gap-x-12 gap-y-5 px-6 lg:px-16 py-5" style={{margin:"16px"}}>
        {categories.map((category) => {
          const Icon = getCategoryIcon(category.slug, category.id);
          const isActive = activeId === category.id;
          const subCats = subCategoriesByCategory[category.id] ?? [];
          const subtitle = category.description || (subCats.length ? subCats.map((s) => s.name).join(" • ") : "");

          return (
            <div key={category.id} className="relative flex-shrink-0">
              <button
                onClick={() => setActiveId(isActive ? null : category.id)}
                className="flex items-center gap-1 text-black font-bold px-4 py-2.5 hover:text-yellow-300 transition-colors whitespace-nowrap"
              >
                <Icon className="w-5 h-5 text-yellow-300 flex-shrink-0" />
                <span className="text-sm lg:text-base">{category.name}</span>
              </button>
              {isActive && <div className="h-0.5 bg-yellow-400 mt-1" />}
              {isActive && (subtitle || subCats.length > 0) && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-72 bg-white text-blue-900 text-xs rounded-lg shadow-xl p-3 z-50">
                  {subCats.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {subCats.map((sc) => (
                        <span key={sc.id} className="bg-blue-50 px-2 py-0.5 rounded text-blue-900">
                          {sc.name} 
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ===== MOBILE ===== */}
      <div className="md:hidden px-4 py-3 bg-blue-900">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-full flex items-center justify-between px-4 py-2 bg-white text-blue-900 rounded-lg font-semibold border border-yellow-400"
        >
          <span>Categories</span>
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        {isMobileMenuOpen && (
          <div className="mt-2 bg-white border border-yellow-400 rounded-lg shadow-lg overflow-hidden">
            {categories.map((category) => {
              const Icon = getCategoryIcon(category.slug, category.id);
              const subCats = subCategoriesByCategory[category.id] ?? [];
              const subtitle = category.description || (subCats.length ? subCats.map((s) => s.name).join(" • ") : "");
              return (
                <div
                  key={category.id}
                  className="px-5 py-4 border-b last:border-b-0 hover:bg-blue-50"
                >
                  <div className="flex items-center gap-4">
                    <Icon className="w-5 h-5 text-blue-700 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-semibold text-blue-900">{category.name}</div>
                      {subtitle && <div className="text-xs text-gray-600 mt-0.5">{subtitle}</div>}
                      {subCats.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {subCats.map((sc) => (
                            <span key={sc.id} className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                              {sc.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
