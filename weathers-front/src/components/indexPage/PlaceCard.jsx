import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {getWeatherIcon} from '../../utils/getWeatherIcon.jsx';
import {getWindDirection} from "../../utils/geWindDirection.jsx";
import mainStore from "../../store/mainStore.jsx";
import InfoModal from "../InfoModal.jsx";
import {useNavigate} from "react-router-dom";
import HourForecast from "../HourForecast.jsx";

function PlaceCard({ place, isNew }) {
    const { user,saveSearchToDB,getWeatherData, setWeatherData } = mainStore()
    const nav = useNavigate();
    // Local states for weather data, loading, error, and modal visibility
    const [weather, setWeather] = useState(getWeatherData(place.place_id));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [modal, setModal] = useState(false);

    // Function to navigate to the city page if the user is logged in
    async function goToCityPage (place){
        if (user) {
            await saveSearchToDB(place);// Save search to database
            nav(`/city/${place.name}?displayName=${place.display_name}&lat=${place.lat}&lon=${place.lon}`)
        } else {
            setModal(true);// Show login modal if user is not logged in
        }
    }

    // Fetch weather data only if it's a new place and no data exists
    useEffect(() => {
        if (!weather && isNew) {
            fetchWeatherData();
        }
    }, [weather, isNew]);

    // Function to fetch weather data from the API
    const fetchWeatherData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
                params: {
                    latitude: place.lat,
                    longitude: place.lon,
                    daily: ["weather_code", "temperature_2m_max", "temperature_2m_min","precipitation_sum", "wind_direction_10m_dominant"],
                    hourly: ["temperature_2m", "weather_code", "dew_point_2m", "apparent_temperature", "precipitation","wind_speed_10m"],
                    current: ["temperature_2m", "precipitation", "weather_code", "wind_speed_10m", "apparent_temperature", "showers", "pressure_msl", "wind_gusts_10m", "relative_humidity_2m", "rain", "cloud_cover", "wind_direction_10m", "is_day"],
                    timezone: "auto"
                }
            });
            setWeather(response.data);
            setWeatherData(place.place_id, response.data);
        } catch (err) {
            setError('Failed to retrieve data. Check your internet connection or click later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Get wind direction data
    const { dir, rotation } = getWindDirection(weather?.current.wind_direction_10m);
    return (
        <div className=" w-full bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4">
                {/* Place name */}
                <h2 className="text-2xl font-bold text-gray-800">{place.name}</h2>
                <p className="text-sm text-gray-500 truncate" title={place.display_name}>
                    {place.display_name}
                </p>

                {/* Loading indicator */}
                {loading && <div className="text-gray-500 mt-2">Loading data...</div>}

                {/* Error message */}
                {error && <div className="text-red-500 mt-2">{error}</div>}

                {/* Current weather data */}
                {weather && (
                    <div className="mt-6">
                        <div className="flex items-center justify-between mb-4">
                            {/* Weather icon and temperature */}
                            <img
                                src={`/icons/${getWeatherIcon(weather.current.weather_code, weather.current.is_day)}.svg`}
                                alt="Weather forecast icon"
                                className="w-12 h-12"
                            />
                            <div className="text-center">
                                <p className="text-xl font-semibold">{weather.current.temperature_2m >= 0? `+${weather.current.temperature_2m}` :weather.current.temperature_2m }°C</p>
                                <p className="text-sm text-gray-500">Feels like: {weather.current.apparent_temperature >= 0? `+${weather.current.apparent_temperature}` :weather.current.apparent_temperature}°C</p>
                            </div>
                        </div>

                        {/* Time and additional data */}
                        <div className="text-sm text-gray-600 space-y-2">
                            <p>Time: {new Date(weather.current.time).toLocaleString(navigator.language, { dateStyle: "short", timeStyle: "short" })}</p>
                            <p>Wind speed: {(weather.current.wind_speed_10m/ 3.6).toFixed(1)} m/s</p>
                            <p>Precipitation: {weather.current.precipitation} mm</p>
                            <p>{weather.current.is_day ? "Daytime" : "Nighttime"}</p>
                            <p>Wind direction: {dir}</p>
                        </div>

                        {/* Next 5-hour forecast */}
                        <HourForecast weather={weather}/>
                    </div>
                )}
            </div>
            <button className="btn m-1" onClick={()=> goToCityPage(place)}>More info</button>
            {/* Info Modal for login requirement */}
            {modal && <InfoModal isOpen={modal} onClose={() => setModal(false)}/>}
        </div>
    );
}

export default PlaceCard;
