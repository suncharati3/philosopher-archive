import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface PhilosopherFiltersProps {
  eras: string[];
  concepts: string[];
  onFilterChange: (type: string, value: string) => void;
  activeFilters: Record<string, string[]>;
}

const PhilosopherFilters = ({
  eras = [],
  concepts = [],
  onFilterChange,
  activeFilters = { era: [], concept: [] },
}: PhilosopherFiltersProps) => {
  const removeFilter = (type: string, value: string) => {
    onFilterChange(type, value);
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              Era
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[200px]">
            {eras.map((era) => (
              <DropdownMenuItem
                key={era}
                onClick={() => onFilterChange("era", era)}
                className="cursor-pointer"
              >
                <span className="flex-1">{era}</span>
                {activeFilters.era?.includes(era) && (
                  <span className="text-primary">✓</span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              Concepts
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[200px]">
            {concepts.map((concept) => (
              <DropdownMenuItem
                key={concept}
                onClick={() => onFilterChange("concept", concept)}
                className="cursor-pointer"
              >
                <span className="flex-1">{concept}</span>
                {activeFilters.concept?.includes(concept) && (
                  <span className="text-primary">✓</span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-wrap gap-2">
        {Object.entries(activeFilters).map(([type, values]) =>
          values.map((value) => (
            <Badge
              key={`${type}-${value}`}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {value}
              <button
                onClick={() => removeFilter(type, value)}
                className="ml-1 hover:text-destructive"
              >
                ×
              </button>
            </Badge>
          ))
        )}
      </div>
    </div>
  );
};

export default PhilosopherFilters;