import { create } from "zustand";

const useStore = create(
        (set) => ({
            user: null,
            setUser: (val) => set({ user: val }),
            loggedIn: false,
            setLoggedIn: (val) => set({ loggedIn: val }),
            loading: true,
            setLoading: (val) => set({ loading: val }),

            selectedPlaces: [],
            setSelectedPlaces: (val) => set({ selectedPlaces: val }),
            selectedTournament: null,
            setSelectedTournament: (val) => set({ selectedTournament: val }),
        }),

);

export default useStore;