import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

interface Philosopher {
  id: number;
  name: string;
  era: string;
  nationality: string;
  core_ideas: string;
  profile_image_url: string;
}

interface PhilosophersStore {
  philosophers: Philosopher[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  fetchPhilosophers: () => Promise<void>;
}

export const usePhilosophersStore = create<PhilosophersStore>((set) => ({
  philosophers: [],
  isLoading: false,
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  fetchPhilosophers: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('philosophers')
        .select('*')
        .order('name');
      
      if (error) throw error;
      set({ philosophers: data || [] });
    } catch (error) {
      console.error('Error fetching philosophers:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));