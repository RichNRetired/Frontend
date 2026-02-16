"use client";

import { useEffect, useState } from "react";
import {
  getSections,
  getCategories,
  getSubcategories,
  getFilters,
} from "@/services/catalog";

// 1. Define Types
interface CatalogItem {
  id: number;
  name: string;
}

export default function CatalogPage() {
  const [sections, setSections] = useState<CatalogItem[]>([]);
  const [categories, setCategories] = useState<CatalogItem[]>([]);
  const [subcategories, setSubcategories] = useState<CatalogItem[]>([]);
  const [filters, setFilters] = useState<Record<string, string[]>>({});

  const [sectionId, setSectionId] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [subCategoryId, setSubCategoryId] = useState<string>("");

  const [loading, setLoading] = useState({
    cats: false,
    subs: false,
    filters: false,
  });

  /** Load initial sections */
  useEffect(() => {
    getSections().then(setSections).catch(console.error);
  }, []);

  /** Load categories & RESET children */
  useEffect(() => {
    if (!sectionId) {
      setCategories([]);
      return;
    }
    setLoading((prev) => ({ ...prev, cats: true }));
    getCategories(Number(sectionId))
      .then(setCategories)
      .finally(() => setLoading((prev) => ({ ...prev, cats: false })));

    // Reset lower levels
    setCategoryId("");
    setSubCategoryId("");
    setSubcategories([]);
    setFilters({});
  }, [sectionId]);

  /** Load subcategories & RESET filters */
  useEffect(() => {
    if (!categoryId) {
      setSubcategories([]);
      return;
    }
    setLoading((prev) => ({ ...prev, subs: true }));
    getSubcategories(Number(categoryId))
      .then(setSubcategories)
      .finally(() => setLoading((prev) => ({ ...prev, subs: false })));

    setSubCategoryId("");
    setFilters({});
  }, [categoryId]);

  /** Load filters */
  useEffect(() => {
    if (!subCategoryId) {
      setFilters({});
      return;
    }
    setLoading((prev) => ({ ...prev, filters: true }));
    getFilters(Number(subCategoryId))
      .then(setFilters)
      .finally(() => setLoading((prev) => ({ ...prev, filters: false })));
  }, [subCategoryId]);

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <header className="border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800">Product Catalog</h1>
        <p className="text-gray-500">
          Refine your search by selecting categories below.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Section Select */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Section</label>
          <select
            className="border rounded-lg p-2 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
            value={sectionId}
            onChange={(e) => setSectionId(e.target.value)}
          >
            <option value="">All Sections</option>
            {sections.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Category Select */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Category</label>
          <select
            disabled={!sectionId || loading.cats}
            className="border rounded-lg p-2 bg-white shadow-sm disabled:bg-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">
              {loading.cats ? "Loading..." : "Select Category"}
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory Select */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Subcategory
          </label>
          <select
            disabled={!categoryId || loading.subs}
            className="border rounded-lg p-2 bg-white shadow-sm disabled:bg-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
            value={subCategoryId}
            onChange={(e) => setSubCategoryId(e.target.value)}
          >
            <option value="">
              {loading.subs ? "Loading..." : "Select Subcategory"}
            </option>
            {subcategories.map((sc) => (
              <option key={sc.id} value={sc.id}>
                {sc.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filters Display */}
      {subCategoryId && (
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 animate-in fade-in slide-in-from-top-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            Available Filters
            {loading.filters && (
              <span className="text-xs font-normal text-gray-400 animate-pulse">
                (Updating...)
              </span>
            )}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(filters).map(([key, values]) => (
              <div
                key={key}
                className="bg-white p-3 rounded-md shadow-sm border"
              >
                <span className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-1">
                  {key}
                </span>
                <div className="flex flex-wrap gap-2">
                  {values.map((v) => (
                    <span
                      key={v}
                      className="px-2 py-1 bg-blue-50 text-blue-700 text-sm rounded"
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
