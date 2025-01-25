import { useEffect, useRef, useState } from "react";
import PhilosopherCard from "./PhilosopherCard";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";
import { Skeleton } from "./ui/skeleton";

const ITEMS_PER_PAGE = 9;

const PhilosopherGrid = () => {
  const { philosophers, isLoading, fetchPhilosophers, searchQuery } = usePhilosophersStore();
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchPhilosophers();
  }, [fetchPhilosophers]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleItems < philosophers.length) {
          setVisibleItems((prev) => Math.min(prev + ITEMS_PER_PAGE, philosophers.length));
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [visibleItems, philosophers.length]);

  const filteredPhilosophers = philosophers.filter((philosopher) =>
    philosopher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    philosopher.era?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    philosopher.nationality?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-[300px] w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPhilosophers.slice(0, visibleItems).map((philosopher) => (
          <PhilosopherCard
            key={philosopher.id}
            name={philosopher.name}
            era={philosopher.era}
            nationality={philosopher.nationality}
            coreIdeas={philosopher.core_ideas}
            imageUrl={philosopher.profile_image_url}
          />
        ))}
      </div>
      {visibleItems < filteredPhilosophers.length && (
        <div ref={loadMoreRef} className="h-20" />
      )}
    </div>
  );
};

export default PhilosopherGrid;