import { create } from "zustand";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const useStore = create((set,get) => ({

    // User state management
    user: null,
    setUser: (val) => set({ user: val }),

    // Loading state for async operations
    loading: false,
    setLoading: (val) => set({ loading: val }),

    selectedPlaces: [],
    setSelectedPlaces: (val) => set({ selectedPlaces: val }),


    // Weather data storage and initialization
    weatherData: {},
    weatherInitialized: false,
    setWeatherData: (placeId, data) =>
        set((state) => ({
            weatherData: { ...state.weatherData, [placeId]: data },
        })),

    //  Initializes weather data for multiple places.
    // *Ensures that uninitialized places have a null value in the state.
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

    // Saves a searched place to the database for the authenticated user.
    saveSearchToDB: async (place) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const res = await axios.post(`${BACKEND_URL}/save-search`,
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