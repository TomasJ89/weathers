import React, {useEffect, useState} from 'react';
import Header from "../components/indexPage/Header.jsx";
import Search from "../components/indexPage/Search.jsx";
import PlaceCard from "../components/indexPage/PlaceCard.jsx";
import mainStore from "../store/mainStore.jsx";
import Aside from "../components/indexPage/Aside.jsx";
import Pagination from "../components/Pagination.jsx";

function Index() {
    // const { selectedPlaces } = mainStore();
    const { getWeatherData,initializeWeatherData } = mainStore()
    const selectedPlaces = JSON.parse(localStorage.getItem("searchHistory")) || []; // get data from local storage
    const itemsPerPage = 8; //Defines 8 items per page
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(selectedPlaces.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedPlaces = selectedPlaces.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => {
        initializeWeatherData(selectedPlaces);
    }, []);

    // Pagination handler
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div>
            <Header />
            <div className="flex flex-col sm:flex-row gap-4 p-4">
                {/*Displays the last 10 searches from local storage and searches for locations starting from 4 letters.*/}
                <aside className="w-full sm:w-1/4">
                    <Search />
                    <Aside />
                </aside>
                {/*rendering last 10 searched places.*/}
                <div className="w-full sm:w-3/4">
                    <div className="grid grid-cols-1 sm:grid-cols-2  xl:grid-cols-4 gap-4">
                        {paginatedPlaces.map((place) => (
                            <PlaceCard key={place.place_id} place={place} isNew={!getWeatherData(place.place_id)}  />
                        ))}
                    </div>

                    {/*If selectedPlaces are more than 8, pagination appears.*/}
                    {selectedPlaces.length > itemsPerPage && (
                        <div className="flex justify-center mt-2">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Index;




