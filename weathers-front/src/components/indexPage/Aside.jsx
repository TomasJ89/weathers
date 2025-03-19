import React from 'react';

function Aside() {
    const places = JSON.parse(localStorage.getItem("searchHistory")) || [];

    return (

        <aside className=" bg-gray-100 p-4">
            <h2 className="text-lg font-semibold">Search History</h2>
            <ul>
                {places.length > 0 && places.map((place) => (
                    <li key={place.place_id} className="p-2 border-b">{place.name}</li>
                ))}
            </ul>
        </aside>
    );
}

export default Aside;