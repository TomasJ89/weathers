import React, { useState } from "react";
import axios from "axios";
import mainStore from "../store/mainStore.jsx";
import {useNavigate} from "react-router-dom";

function MostViewed({ mostViewed }) {
    const [viewedList, setViewedList] = useState(mostViewed);
    const { user, saveSearchToDB} = mainStore();
    const nav = useNavigate();

    const handleRemove = async (placeId) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const res = await axios.delete(`http://localhost:2000/delete-place/${placeId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.data.success) {
                setViewedList(res.data.data.mostViewed);
            }
        } catch (error) {
            console.error("Error deleting place:", error);
        }
    };

    async function goToCityPage(place) {
        if (user) {
            await saveSearchToDB(place);
            nav(`/city/${place.name}?displayName=${place.display_name}&lat=${place.lat}&lon=${place.lon}`);
        }
    }

    return (
        <div className="max-w-4xl mx-auto mt-6 bg-white p-4 shadow-lg rounded-lg">
            <h2 className="text-xl font-bold text-center mb-4">Your Most Viewed Places</h2>
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
                                    event.stopPropagation();
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