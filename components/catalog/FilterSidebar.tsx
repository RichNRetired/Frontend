import { Filter, AlertCircle } from "lucide-react";

interface FilterOption {
  id: number;
  name: string;
}

interface FilterSidebarProps {
  isLoading?: boolean;
  options: FilterOption[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
  label: string;
  disabled?: boolean;
  disabledMessage?: string;
}

const SkeletonLoader = () => (
  <div className="space-y-3">
    <div className="h-10 bg-gray-200 rounded-lg animate-pulse" />
  </div>
);

export function FilterSidebar({
  isLoading,
  options,
  selectedId,
  onSelect,
  label,
  disabled,
  disabledMessage,
}: FilterSidebarProps) {
  return (
    <div className={`space-y-3 ${disabled ? "opacity-50" : "opacity-100"}`}>
      <label className="block text-sm font-semibold text-gray-900 uppercase tracking-wide">
        {label}
      </label>
      {isLoading ? (
        <SkeletonLoader />
      ) : disabled ? (
        <p className="text-sm text-gray-400">
          {disabledMessage || "Select a filter first"}
        </p>
      ) : (
        <div className="space-y-2">
          <button
            onClick={() => onSelect(null)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              !selectedId
                ? "bg-blue-50 text-blue-700"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            All {label}s
          </button>
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => onSelect(option.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedId === option.id
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {option.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
