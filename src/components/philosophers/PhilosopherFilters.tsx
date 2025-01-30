import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Filter, Clock, BookOpen, Lightbulb } from "lucide-react";

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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[280px]">
          {/* Era Section */}
          <DropdownMenuLabel className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Filter by Era
          </DropdownMenuLabel>
          <div className="max-h-[200px] overflow-y-auto py-1">
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
          </div>

          <DropdownMenuSeparator />

          {/* Concepts Section */}
          <DropdownMenuLabel className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Filter by Concepts
          </DropdownMenuLabel>
          <div className="max-h-[200px] overflow-y-auto py-1">
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
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Active Filters Display */}
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