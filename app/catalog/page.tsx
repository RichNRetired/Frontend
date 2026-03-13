"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCatalogFlow } from "@/hooks/useCatalogFlow";
import { FilterSidebar } from "@/components/catalog/FilterSidebar";
import { FilterDisplay } from "@/components/catalog/FilterDisplay";
import { CatalogBreadcrumb } from "@/components/catalog/CatalogBreadcrumb";
import { CatalogEmptyState } from "@/components/catalog/CatalogEmptyState";
import { Menu, X, SlidersHorizontal } from "lucide-react";

export default function CatalogPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const {
    state,
    setSectionId,
    setCategoryId,
    setSubCategoryId,
    sections,
    categories,
    subcategories,
    filters,
    isLoadingSections,
    isLoadingCategories,
    isLoadingSubcategories,
    isLoadingFilters,
  } = useCatalogFlow(searchQuery);

  const selectedSection = sections.find((s) => s.id === state.sectionId);
  const selectedCategory = categories.find((c) => c.id === state.categoryId);
  const selectedSubcategory = subcategories.find(
    (sc) => sc.id === state.subCategoryId,
  );

  const breadcrumbItems = [
    ...(selectedSection ? [{ label: selectedSection.name.toUpperCase() }] : []),
    ...(selectedCategory
      ? [{ label: selectedCategory.name.toUpperCase() }]
      : []),
    ...(selectedSubcategory
      ? [{ label: selectedSubcategory.name.toUpperCase() }]
      : []),
  ];

  return (
    <main className="min-h-screen bg-white text-black selection:bg-black selection:text-white overflow-x-hidden">
      {/* Editorial Header */}
      <header className="pt-12 mt-10 md:pt-20 pb-6 px-6 md:px-12 border-b border-gray-100 lg:border-transparent">
        <div className="max-w-[1800px] mx-auto flex justify-between items-end">
          <div className="flex flex-col gap-2 md:gap-4">
            <nav className="text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-gray-400">
              <CatalogBreadcrumb items={breadcrumbItems} />
            </nav>
            <h1 className="text-2xl md:text-7xl font-bold tracking-tighter uppercase leading-[0.8]">
              {searchQuery
                ? `Search Results: "${searchQuery}"`
                : selectedCategory?.name ||
                  selectedSection?.name ||
                  "The Collection"}
            </h1>
          </div>

          {/* Mobile Toggle Trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden flex items-center gap-2 uppercase text-[10px] tracking-widest font-bold pb-1 border-b border-black"
          >
            Filters <Menu className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Grid Layout */}
      <div className="max-w-[1800px] mx-auto px-0 md:px-12 py-4 md:py-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Desktop Sidebar (Left side, hidden on mobile) */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-10">
              <section>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-6 border-b border-black pb-2">
                  Refine By
                </h2>
                <div className="space-y-8 text-[11px]">
                  <FilterSidebar
                    isLoading={isLoadingSections}
                    options={sections}
                    selectedId={state.sectionId}
                    onSelect={setSectionId}
                    label="SECTION"
                  />
                  <FilterSidebar
                    isLoading={isLoadingCategories}
                    options={categories}
                    selectedId={state.categoryId}
                    onSelect={setCategoryId}
                    label="CATEGORY"
                    disabled={!state.sectionId}
                  />
                  <FilterSidebar
                    isLoading={isLoadingSubcategories}
                    options={subcategories}
                    selectedId={state.subCategoryId}
                    onSelect={setSubCategoryId}
                    label="SUBCATEGORY"
                    disabled={!state.categoryId}
                  />
                </div>
              </section>
            </div>
          </aside>

          {/* Mobile Right Sidebar Drawer */}
          <div
            className={`fixed inset-0 z-[100] transition-opacity duration-300 lg:hidden ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Content Container (Sliding from right) */}
            <div
              className={`absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-500 ease-out p-8 ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
            >
              <div className="flex justify-between items-center mb-12">
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase">
                  Navigation
                </span>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-6 h-6 stroke-1" />
                </button>
              </div>

              <div className="space-y-12">
                {/* We reuse the components but they'll be styled by your CSS for the drawer */}
                <FilterSidebar
                  isLoading={isLoadingSections}
                  options={sections}
                  selectedId={state.sectionId}
                  onSelect={setSectionId}
                  label="SECTION"
                />
                <FilterSidebar
                  isLoading={isLoadingCategories}
                  options={categories}
                  selectedId={state.categoryId}
                  onSelect={setCategoryId}
                  label="CATEGORY"
                  disabled={!state.sectionId}
                />
                <FilterSidebar
                  isLoading={isLoadingSubcategories}
                  options={subcategories}
                  selectedId={state.subCategoryId}
                  onSelect={setSubCategoryId}
                  label="SUBCATEGORY"
                  disabled={!state.categoryId}
                />
              </div>

              <div className="absolute bottom-8 left-8 right-8">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full bg-black text-white py-4 text-[10px] font-bold uppercase tracking-widest"
                >
                  View Results
                </button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <section className="flex-1 px-4 md:px-0">
            <div className="min-h-[60vh]">
              {!state.sectionId && !searchQuery ? (
                <CatalogEmptyState type="start" />
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
                  <FilterDisplay
                    filters={filters}
                    isLoading={isLoadingFilters}
                  />
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
