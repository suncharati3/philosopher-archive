import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type Philosopher = Database["public"]["Tables"]["philosophers"]["Row"] & {
  is_religious?: boolean;
};

export type Category = "all" | "philosophers" | "religious";

interface PhilosophersStore {
  philosophers: Philosopher[];
  isLoading: boolean;
  searchQuery: string;
  selectedPhilosopher: Philosopher | null;
  selectedCategory: Category;
  setSearchQuery: (query: string) => void;
  setSelectedPhilosopher: (philosopher: Philosopher | null) => void;
  setSelectedCategory: (category: Category) => void;
  fetchPhilosophers: () => Promise<void>;
}

export const usePhilosophersStore = create<PhilosophersStore>((set) => ({
  philosophers: [],
  isLoading: false,
  searchQuery: "",
  selectedPhilosopher: null,
  selectedCategory: "all",
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedPhilosopher: (philosopher) =>
    set({ selectedPhilosopher: philosopher }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  fetchPhilosophers: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from("philosophers")
        .select("*")
        .order("name");

      if (error) throw error;

      const philosophersWithCategory = (data || []).map((philosopher) => ({
        ...philosopher,
        is_religious:
          philosopher.era?.toLowerCase().includes("religious") || false,
      }));

      set({ philosophers: philosophersWithCategory });
    } catch (error) {
      console.error("Error fetching philosophers:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));

export type { Philosopher };
