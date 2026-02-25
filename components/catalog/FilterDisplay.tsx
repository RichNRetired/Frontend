import { Filter, AlertCircle, Loader2 } from "lucide-react";

interface FilterDisplayProps {
  filters: Record<string, string[]>;
  isLoading?: boolean;
  onFilterSelect?: (filterKey: string, value: string) => void;
}

const FilterSkeleton = () => (
  <div className="space-y-2">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="bg-gray-100 h-8 rounded animate-pulse" />
    ))}
  </div>
);

export function FilterDisplay({
  filters,
  isLoading,
  onFilterSelect,
}: FilterDisplayProps) {
  return (
    <div className="space-y-6">
      {/* Filters Header */}
      <div>
        <h3 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
          <span>Available Filters</span>
          {isLoading && (
            <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
          )}
        </h3>
        <p className="text-gray-600 text-sm mt-1">
          Refine your search with these available filter options
        </p>
      </div>

      {/* Filters Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <FilterSkeleton key={i} />
          ))}
        </div>
      ) : Object.keys(filters).length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(filters).map(([key, values]) => (
            <div
              key={key}
              className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <h4 className="text-sm font-bold uppercase tracking-widest text-gray-700 mb-3">
                {key}
              </h4>
              <div className="flex flex-wrap gap-2">
                {values.map((v) => (
                  <button
                    key={v}
                    onClick={() => onFilterSelect?.(key, v)}
                    className="px-3 py-1 bg-white text-gray-700 text-sm rounded-full border border-gray-300 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 space-y-3">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto" />
          <p className="text-gray-500">
            No filters available for this subcategory
          </p>
        </div>
      )}
    </div>
  );
}
