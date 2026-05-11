import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
  isWalletConnected: boolean;
  walletAddress: string | null;
  setWallet: (address: string | null) => void;
  
  // Market filters
  activeCategory: string;
  setCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Telegram User info
  user: any | null;
  setUser: (user: any) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isWalletConnected: false,
      walletAddress: null,
      setWallet: (address) => set({ 
        walletAddress: address, 
        isWalletConnected: !!address 
      }),

      activeCategory: "all",
      setCategory: (category) => set({ activeCategory: category }),
      
      searchQuery: "",
      setSearchQuery: (query) => set({ searchQuery: query }),

      user: null,
      setUser: (user) => set({ user }),
    }),
    {
      name: "tonbet-storage",
    }
  )
);
