import React, { useState } from 'react';
import {useNavigate} from "react-router-dom";
import mainStore from "../../store/mainStore.jsx";
import InfoModal from "../InfoModal.jsx";
function Aside() {
    const{user,saveSearchToDB} = mainStore()
    const places = JSON.parse(localStorage.getItem("searchHistory")) || [];
    const [isOpen, setIsOpen] = useState(false);
    const [modal, setModal] = useState(false);
    const nav = useNavigate();
    const toggleDropdown = () => setIsOpen(!isOpen);

    async function goToCityPage (place){
        if (user) {
            await saveSearchToDB(place);
            nav(`/city/${place.name}?displayName=${place.display_name}&lat=${place.lat}&lon=${place.lon}`)
        } else {
            setModal(true);
        }
    }

    return (
        <aside className="bg-gray-100 p-4 relative">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Search History</h2>
                <div className="sm:hidden">
                    <button
                        onClick={toggleDropdown}
                        className="flex items-center">
                        <svg
                            className={`w-5 h-5 transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="black"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            {isOpen && (
                <ul className="sm:hidden mt-2">
                    {places.length > 0 && places.map((place) => (
                        <li key={place.place_id} className="p-2 border-b hover:cursor-pointer"
                            onClick={()=> goToCityPage(place)}
                        >{place.name}</li>
                    ))}
                </ul>
            )}
            <div className="hidden sm:block mt-2">
                <ul>
                    {places.length > 0 && places.map((place) => (
                        <li key={place.place_id} className="p-2 border-b hover:cursor-pointer"
                            onClick={()=> goToCityPage(place)}
                        >{place.name}</li>
                    ))}
                </ul>
            </div>
            {modal && <InfoModal isOpen={modal} onClose={() => setModal(false)}/>}
        </aside>
    );
}

export default Aside;
