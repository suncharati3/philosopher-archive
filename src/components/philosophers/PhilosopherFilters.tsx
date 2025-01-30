import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

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
  const [openEra, setOpenEra] = useState(false);
  const [openConcepts, setOpenConcepts] = useState(false);

  const removeFilter = (type: string, value: string) => {
    onFilterChange(type, value);
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex gap-2">
        <Popover open={openEra} onOpenChange={setOpenEra}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openEra}
              className="w-[140px] justify-between"
            >
              Era
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search era..." />
              <CommandEmpty>No era found.</CommandEmpty>
              <CommandGroup>
                {(eras || []).map((era) => (
                  <CommandItem
                    key={era}
                    value={era}
                    onSelect={() => {
                      onFilterChange("era", era);
                      setOpenEra(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        activeFilters.era?.includes(era)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {era}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        <Popover open={openConcepts} onOpenChange={setOpenConcepts}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openConcepts}
              className="w-[140px] justify-between"
            >
              Concepts
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search concepts..." />
              <CommandEmpty>No concept found.</CommandEmpty>
              <CommandGroup>
                {(concepts || []).map((concept) => (
                  <CommandItem
                    key={concept}
                    value={concept}
                    onSelect={() => {
                      onFilterChange("concept", concept);
                      setOpenConcepts(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        activeFilters.concept?.includes(concept)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {concept}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-wrap gap-2">
        {Object.entries(activeFilters || {}).map(([type, values]) =>
          (values || []).map((value) => (
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