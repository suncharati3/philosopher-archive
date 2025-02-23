import { Category, type Philosopher } from "@/store/usePhilosophersStore";

interface FilterOptions {
  searchQuery: string;
  selectedCategory: Category;
  activeFilters?: Record<string, string[]>;
}

export const isReligiousFigure = (philosopher: Philosopher) => {
  const religiousKeywords = [
    "prophet",
    "religious",
    "religion",
    "christ",
    "muhammad",
    "moses",
  ];
  return religiousKeywords.some(
    (keyword) =>
      philosopher.era?.toLowerCase().includes(keyword) ||
      philosopher.name?.toLowerCase().includes(keyword) ||
      philosopher.core_ideas?.toLowerCase().includes(keyword)
  );
};

const extractYear = (timeline: string | null): number | null => {
  if (!timeline) return null;
  const match = timeline.match(/-?\d+/);
  return match ? parseInt(match[0]) : null;
};

export const filterPhilosophers = (
  philosophers: Philosopher[],
  options: FilterOptions
) => {
  const { searchQuery, selectedCategory, activeFilters = {} } = options;

  return philosophers.filter((philosopher) => {
    // Basic search and category filtering
    const matchesSearch =
      !searchQuery ||
      philosopher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      philosopher.era?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      philosopher.nationality
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

    const isReligious = isReligiousFigure(philosopher);
    const matchesCategory =
      selectedCategory === "all" ||
      (selectedCategory === "philosophers" && !isReligious) ||
      (selectedCategory === "religious" && isReligious);

    // Timeline filtering
    let matchesTimeline = true;
    if (activeFilters.timeline?.length) {
      const timelineRange = activeFilters.timeline[0].split("-").map(Number);
      const philosopherYear = extractYear(philosopher.timeline);
      if (philosopherYear !== null) {
        matchesTimeline =
          philosopherYear >= timelineRange[0] &&
          philosopherYear <= timelineRange[1];
      }
    }

    // Era and concept filtering
    const matchesEra =
      !activeFilters.era?.length ||
      (philosopher.era && activeFilters.era.includes(philosopher.era));

    const matchesConcepts =
      !activeFilters.concept?.length ||
      activeFilters.concept.every((concept) =>
        philosopher.core_ideas?.toLowerCase().includes(concept.toLowerCase())
      );

    return (
      matchesSearch &&
      matchesCategory &&
      matchesEra &&
      matchesConcepts &&
      matchesTimeline
    );
  });
};
