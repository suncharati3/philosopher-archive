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
import { Filter, Clock, Lightbulb, Calendar } from "lucide-react";
import { Slider } from "@/components/ui/slider";

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
  const [timelineRange, setTimelineRange] = useState<[number, number]>([-600, 2024]);

  const removeFilter = (type: string, value: string) => {
    if (type === 'timeline') {
      // Reset the timeline range when removing the filter
      setTimelineRange([-600, 2024]);
      // Remove the timeline filter
      onFilterChange('timeline', value);
    } else {
      onFilterChange(type, value);
    }
  };

  const handleTimelineCommit = (values: number[]) => {
    const [start, end] = values;
    const timelineFilter = `${start}-${end}`;
    
    // Remove any existing timeline filter before adding the new one
    if (activeFilters.timeline?.length) {
      activeFilters.timeline.forEach(filter => {
        onFilterChange('timeline', filter); // This will remove the filter
      });
    }
    
    // Add the new timeline filter
    onFilterChange('timeline', timelineFilter);
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
        <DropdownMenuContent 
          align="start" 
          className="w-[320px] bg-white border border-border shadow-lg"
        >
          {/* Timeline Section */}
          <DropdownMenuLabel className="flex items-center gap-2 pt-4">
            <Calendar className="h-4 w-4" />
            Timeline
          </DropdownMenuLabel>
          <div className="px-4 py-4">
            <Slider
              defaultValue={[-600, 2024]}
              max={2024}
              min={-600}
              step={100}
              value={[timelineRange[0], timelineRange[1]]}
              onValueChange={(values) => setTimelineRange([values[0], values[1]])}
              onValueCommit={handleTimelineCommit}
              className="w-full"
              minStepsBetweenThumbs={1}
            />
            <div className="text-sm text-muted-foreground mt-2 text-center">
              Year: {timelineRange[0]} to {timelineRange[1]}
            </div>
          </div>

          <DropdownMenuSeparator />

          {/* Era Section */}
          <DropdownMenuLabel className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Filter by Era
          </DropdownMenuLabel>
          <div className="max-h-[200px] overflow-y-auto py-2">
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
          <div className="max-h-[200px] overflow-y-auto py-2">
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
              {type === 'timeline' ? `Timeline: ${value.replace('-', ' to ')}` : value}
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