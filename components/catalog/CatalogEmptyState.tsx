import { Filter, Loader2, AlertCircle } from "lucide-react";

type EmptyStateType = "start" | "loading" | "error";

interface CatalogEmptyStateProps {
  type: EmptyStateType;
  message?: string;
}

export function CatalogEmptyState({ type, message }: CatalogEmptyStateProps) {
  const config: Record<
    EmptyStateType,
    {
      icon: typeof Filter;
      title: string;
      description: string;
      animate?: boolean;
    }
  > = {
    start: {
      icon: Filter,
      title: "Start Browsing",
      description:
        "Select a section from the filter panel to begin exploring our product catalog",
    },
    loading: {
      icon: Loader2,
      title: "Loading",
      description: message || "Please wait...",
      animate: true,
    },
    error: {
      icon: AlertCircle,
      title: "Something went wrong",
      description: message || "Unable to load content. Please try again.",
    },
  };

  const config_item = config[type];
  const Icon = config_item.icon;
  const { title, description, animate } = config_item;

  return (
    <div className="text-center py-16 space-y-4">
      <Icon
        className={`w-16 h-16 text-gray-300 mx-auto ${animate ? "animate-spin" : ""}`}
      />
      <h3 className="text-2xl font-light text-gray-600">{title}</h3>
      <p className="text-gray-500 max-w-md mx-auto">{description}</p>
    </div>
  );
}
