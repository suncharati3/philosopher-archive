import { type Philosopher } from "@/store/usePhilosophersStore";

interface FilterOptions {
  searchQuery: string;
  selectedCategory: 'all' | 'philosophers' | 'religious';
}

export const isReligiousFigure = (philosopher: Philosopher) => {
  const religiousKeywords = ['prophet', 'religious', 'religion', 'christ', 'muhammad', 'moses'];
  return (
    religiousKeywords.some(keyword => 
      philosopher.era?.toLowerCase().includes(keyword) ||
      philosopher.name?.toLowerCase().includes(keyword) ||
      philosopher.core_ideas?.toLowerCase().includes(keyword)
    )
  );
};

export const filterPhilosophers = (philosophers: Philosopher[], options: FilterOptions) => {
  const { searchQuery, selectedCategory } = options;

  return philosophers.filter((philosopher) => {
    const matchesSearch = !searchQuery || 
      philosopher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      philosopher.era?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      philosopher.nationality?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const isReligious = isReligiousFigure(philosopher);
    const matchesCategory = 
      selectedCategory === 'all' || 
      (selectedCategory === 'philosophers' && !isReligious) ||
      (selectedCategory === 'religious' && isReligious);
    
    return matchesSearch && matchesCategory;
  });
};