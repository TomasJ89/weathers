import { create } from "zustand";
import axios from "axios";

const useStore = create((set,get) => ({
    user: null,
    setUser: (val) => set({ user: val }),
    loggedIn: false,
    setLoggedIn: (val) => set({ loggedIn: val }),
    loading: false,
    setLoading: (val) => set({ loading: val }),

    selectedPlaces: [],
    setSelectedPlaces: (val) => set({ selectedPlaces: val }),
    weatherData: {},
    weatherInitialized: false,
    setWeatherData: (placeId, data) =>
        set((state) => ({
            weatherData: { ...state.weatherData, [placeId]: data },
        })),
    getWeatherData: (placeId) => get().weatherData[placeId] || null,
    initializeWeatherData: (places) => {
        if (get().weatherInitialized) return;
        let existingWeather = get().weatherData;
        let updatedWeatherData = { ...existingWeather };

        places.forEach((place) => {
            if (!existingWeather[place.place_id]) {
                updatedWeatherData[place.place_id] = null;
            }
        });
        set({
            weatherData: updatedWeatherData,
            weatherInitialized: true,
        });
    },

    saveSearchToDB: async (place) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const res = await axios.post("http://localhost:2000/save-search",
                { place },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                set({ user: res.data.data });
            }
        } catch (error) {
            console.error("Error saving search to database:", error);
        }
    }
}));

export default useStore;