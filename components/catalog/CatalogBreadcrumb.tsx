import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
}

interface CatalogBreadcrumbProps {
  items: BreadcrumbItem[];
}

export function CatalogBreadcrumb({ items }: CatalogBreadcrumbProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-gray-500">Catalog</span>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-medium">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
