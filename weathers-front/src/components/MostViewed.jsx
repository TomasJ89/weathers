import React, { useState } from "react";
import axios from "axios";
import mainStore from "../store/mainStore.jsx";
import {useNavigate} from "react-router-dom";

function MostViewed({ mostViewed }) {
    const [viewedList, setViewedList] = useState(mostViewed); // State to store most viewed places
    const { user, saveSearchToDB} = mainStore();
    const nav = useNavigate();

    // Function to remove a place from the most viewed list
    const handleRemove = async (placeId) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            // Send DELETE request to remove place from the server
            const res = await axios.delete(`http://localhost:2000/delete-place/${placeId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.data.success) {
                setViewedList(res.data.data.mostViewed); // Update the viewed list after deletion
            }
        } catch (error) {
            console.error("Error deleting place:", error);
        }
    };

    // Function to navigate to the selected city's weather page
    async function goToCityPage(place) {
        if (user) {
            await saveSearchToDB(place);// Save search to the database
            nav(`/city/${place.name}?displayName=${place.display_name}&lat=${place.lat}&lon=${place.lon}`);
        }
    }

    return (
        <div className="max-w-4xl mx-auto mt-6 bg-white p-4 shadow-lg rounded-lg">
            <h2 className="text-xl font-bold text-center mb-4">Your Most Viewed Places</h2>

            {/* Display message if no places have been viewed */}
            {viewedList.length === 0 ? (
                <p className="text-gray-500 text-center">No recently viewed places</p>
            ) : (
                <ul className="space-y-2">
                    {viewedList.map((place) => (
                        <li
                            key={place.place_id}
                            className="flex justify-between items-center hover:bg-gray-200 bg-gray-100 p-3 rounded-lg shadow-md cursor-pointer"
                            onClick={() => goToCityPage(place)}
                        >
                            <div>
                                <p className="text-lg font-semibold">{place.name}</p>
                                <p className="text-sm text-gray-500">
                                    Viewed at: {new Date(place.viewedAt).toLocaleString()}
                                </p>
                            </div>
                            <button
                                className="hover:scale-110"
                                onClick={(event) => {
                                    event.stopPropagation();// Prevents triggering the parent click event
                                    handleRemove(place.place_id);
                                }}
                            >
                                🗑️
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default MostViewed;