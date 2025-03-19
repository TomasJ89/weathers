import { useState, useEffect } from "react";
import mainStore from "../../store/mainStore.jsx";
import axios from "axios";
function Search() {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const {user,selectedPlaces,setSelectedPlaces} = mainStore()

    useEffect(() => {
        if (query.length < 3) {
            setSuggestions([]);
            return;
        }

        const fetchLocations = async () => {
            try {
                const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
                    params: {
                        q: query,
                        format: "json"
                    }
                });
                setSuggestions(response.data);
            } catch (error) {
                console.error("Error fetching location data:", error);
            }
        };

        const debounce = setTimeout(fetchLocations, 300);
        return () => clearTimeout(debounce);
    }, [query]);

    function setPlaces(place){
        setSelectedPlaces([place, ...selectedPlaces]);
        setQuery("");
        setSuggestions([])
        saveSearchToLocalStorage(place);
        if (user) {
            saveSearchToDB(place);
        }
    }
    async function saveSearchToDB(place) {
        try {
            await axios.post("http://localhost:2000/save-search", {
                place: place,
            });
        } catch (error) {
            console.error("Error saving search to database:", error);
        }
    }

    function saveSearchToLocalStorage(place) {
        let searches = JSON.parse(localStorage.getItem("searchHistory")) || [];
        searches = searches.filter(item => item.place_id !== place.place_id);
        searches.unshift(place);
        searches = searches.slice(0, 10);
        localStorage.setItem("searchHistory", JSON.stringify(searches));
    }

    return (
        <div className="m-2 relative">
            <label className="input flex items-center border rounded p-2">
                <svg className="h-[1em] opacity-50 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                    </g>
                </svg>
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
            {suggestions.length > 0 && (
                <ul className="absolute bg-white border rounded mt-1 w-full max-h-60 overflow-auto shadow-lg">
                    {suggestions.map((place, index) => (
                        <li
                            key={index}
                            className="p-2 hover:bg-gray-200 cursor-pointer"
                            onClick={() => setPlaces(place)}
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
