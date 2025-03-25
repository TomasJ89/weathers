import { useState, useEffect } from "react";
import mainStore from "../../store/mainStore.jsx";
import axios from "axios";
import {useNavigate} from "react-router-dom";
function Search() {
    const [query, setQuery] = useState(""); // State for search query input
    const [suggestions, setSuggestions] = useState([]);  // State for storing location suggestions
    const {user,saveSearchToDB,selectedPlaces,setSelectedPlaces} = mainStore()
    const nav= useNavigate();


    // Effect to fetch location suggestions when the query changes
    useEffect(() => {
        // If the query is less than 3 characters, clear suggestions and return
        if (query.length < 3) {
            setSuggestions([]);
            return;
        }
        // Function to fetch location data from OpenStreetMap's API
        const fetchLocations = async () => {
            try {
                const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
                    params: {
                        q: query,
                        format: "json"
                    }
                });
                setSuggestions(response.data);// Update state with fetched data
            } catch (error) {
                console.error("Error fetching location data:", error);
            }
        };

        // Implement debounce to prevent excessive API calls
        const debounce = setTimeout(fetchLocations, 300);
        return () => clearTimeout(debounce);// Cleanup function to clear timeout
    }, [query]);

    // Function to handle place selection
    async function setPlaces(place){
        setSelectedPlaces([place, ...selectedPlaces]); // Add new place to selected places
        setQuery("");// Clear search input
        setSuggestions([]) // Clear suggestions
        saveSearchToLocalStorage(place);// Save search to local storage
        if (user) {
            await saveSearchToDB(place);// Save search to database if user is logged in
            nav(`/city/${place.name}?displayName=${place.display_name}&lat=${place.lat}&lon=${place.lon}`)// Navigate to city page

        }
    }

    // Function to save search history to local storage
    function saveSearchToLocalStorage(place) {
        let searches = JSON.parse(localStorage.getItem("searchHistory")) || [];
        searches = searches.filter(item => item.place_id !== place.place_id);// Remove duplicates
        searches.unshift(place);// Add new search to the top
        searches = searches.slice(0, 10);// Keep only the last 10 searches
        localStorage.setItem("searchHistory", JSON.stringify(searches));
    }

    return (
        <div className=" relative mb-2">
            {/* Search input field */}
            <label className="input w-full  flex items-center border rounded p-2">
                <svg className="h-[1em] opacity-50 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                    </g>
                </svg>
                {/* Search input field */}
                <input
                    type="search"
                    required
                    placeholder="Search your place"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="outline-none flex-1"
                    title="Enter minimum 3 characters"
                />
            </label>
            {/* Display search suggestions if available */}
            {suggestions.length > 0 && (
                <ul className="absolute z-50 bg-white border rounded mt-1 w-full max-h-60 overflow-auto shadow-lg">
                    {suggestions.map((place, index) => (
                        <li
                            key={index}
                            className="p-2 hover:bg-gray-200 cursor-pointer"
                            onClick={() => setPlaces(place)} // Handle place selection
                        >
                            {place.display_name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Search;
