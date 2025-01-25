import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Philosopher = Database['public']['Tables']['philosophers']['Row'];

interface PhilosophersStore {
  philosophers: Philosopher[];
  isLoading: boolean;
  searchQuery: string;
  selectedPhilosopher: Philosopher | null;
  setSearchQuery: (query: string) => void;
  setSelectedPhilosopher: (philosopher: Philosopher | null) => void;
  fetchPhilosophers: () => Promise<void>;
}

export const usePhilosophersStore = create<PhilosophersStore>((set) => ({
  philosophers: [],
  isLoading: false,
  searchQuery: '',
  selectedPhilosopher: null,
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedPhilosopher: (philosopher) => set({ selectedPhilosopher: philosopher }),
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

export type { Philosopher };