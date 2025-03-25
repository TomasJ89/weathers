import React, { useEffect, useState } from 'react';
import { getWeatherIcon } from '../utils/getWeatherIcon';
import { useParams, useSearchParams } from "react-router-dom";
import {getWindDirection} from "../utils/geWindDirection.jsx";
import axios from "axios";
import mainStore from "../store/mainStore.jsx";
import MostViewed from "../components/MostViewed.jsx";
import Search from "../components/indexPage/Search.jsx";
import DaysGrid from "../components/DaysGrid.jsx";
import HourList from "../components/HourList.jsx";

const WeatherCard = () => {
    const {user } = mainStore()
    const { name } = useParams();
    const [searchParams] = useSearchParams();
    const displayName = searchParams.get("displayName");
    const lat = parseFloat(searchParams.get("lat"));
    const lon = parseFloat(searchParams.get("lon"));
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [forecastType, setForecastType] = useState("5days")

    // Fetch weather data when latitude and longitude are available
    useEffect(() => {
        if (!lat || !lon) {
            setError("Wrong data");
            setLoading(false);
            return;
        }
        fetchWeatherData();
    }, [lat, lon]);

    // Function to fetch weather data from Open-Meteo API
    const fetchWeatherData = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
                params: {
                    latitude: lat,
                    longitude: lon,
                    daily: ["weather_code", "temperature_2m_max", "temperature_2m_min", "precipitation_sum", "wind_direction_10m_dominant"],
                    hourly: ["temperature_2m", "weather_code", "dew_point_2m", "apparent_temperature", "precipitation","wind_speed_10m"],
                    current: ["temperature_2m", "precipitation", "weather_code", "wind_speed_10m", "apparent_temperature", "showers", "pressure_msl", "wind_gusts_10m", "relative_humidity_2m", "rain", "cloud_cover", "wind_direction_10m", "is_day"],
                    timezone: "auto"
                }
            });
            setWeatherData(response.data);

        } catch (err) {
            setError('Failed to retrieve data. Check your internet connection or click later');
        } finally {
            setLoading(false);
        }
    };
    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!weatherData) return null;

    const data = weatherData;
    const { dir, rotation } = getWindDirection(data.current.wind_direction_10m);

    return (
        <div className="p-4">
            {/* Search bar */}
            <div className="max-w-4xl mx-auto md:min-w-[745px]">
                <Search/>
            </div>

            {/* Main weather card */}
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 ">
                {/* Current forecast */}
                <div className="border-b pb-4 mt ">
                    <h2 className="text-2xl font-semibold text-gray-800 text-center">{displayName || name}</h2>
                    <p className="text-gray-500 text-sm text-center">
                        Current local time: {new Date(data.current.time).toLocaleTimeString(navigator.language)}
                    </p>

                    {/* Temperature and weather icon */}
                    <div className="flex flex-col md:flex-row items-center justify-between mt-4">
                        <div className="text-center md:text-left">
                            <p className="text-5xl font-bold text-gray-900">
                                {`${data.current.temperature_2m >= 0? '+' : ''}${data.current.temperature_2m}°C`}
                            </p>
                            <p className="text-gray-500 text-lg">
                                feels like {`${data.current.apparent_temperature > 0 ? '+' : ''}${data.current.apparent_temperature}°C`}
                            </p>
                            <p className="text-gray-600">{data.current.precipitation} mm precipitation</p>
                        </div>
                        <img
                            src={`/icons/${getWeatherIcon(data.current.weather_code, data.current.is_day)}.svg`}
                            alt="weather icon"
                            className="w-32 h-32 mt-4 md:mt-0"
                        />
                    </div>

                    {/* Additional weather details */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 text-gray-700 text-sm md:text-base">
                        <p><strong>Pressure:</strong> {data.current.pressure_msl} hPa</p>
                        <p><strong>Cloudiness:</strong> {data.current.cloud_cover}%</p>
                        <p><strong>Wind:</strong> {(data.current.wind_speed_10m/ 3.6).toFixed(1)} m/s</p>
                        <p><strong>Wind gusts:</strong> {(data.current.wind_gusts_10m/ 3.6).toFixed(1)} m/s</p>

                        {/* Wind direction with rotating arrow */}
                        <div className="flex items-center gap-1">
                            <strong>Wind direction:</strong> ({dir})
                            <img
                                src={`/icons/down-arrow.svg`}
                                alt={`wind ${dir}`}
                                className="w-4 h-4"
                                style={{ transform: `rotate(${rotation}deg)` }}
                            />
                        </div>
                        <p><strong>Humidity:</strong> {data.current.relative_humidity_2m}%</p>
                    </div>
                </div>

                {/* Forecast selection buttons */}
                <div className="mt-6">
                    <div className="flex justify-center mb-4">
                        <button
                            className={`px-4 py-2 text-sm font-semibold transition ${
                                forecastType === "5days" ? "border-b-2 border-gray-500 " : "text-gray-500"
                            }`}
                            onClick={() => setForecastType("5days")}
                        >
                            5 Days Forecast
                        </button>
                        <button
                            className={`px-4 py-2 text-sm font-semibold transition ${
                                forecastType === "5hour" ? "border-b-2 border-gray-500 " : "text-gray-500"
                            }`}
                            onClick={() => setForecastType("5hour")}
                        >
                            5 Hour Forecast
                        </button>
                    </div>

                    {/* Display either 5-day or 5-hour forecast */}
                        {forecastType==="5days" ? <DaysGrid data={data}/>:<HourList data={data}/>}


                </div>
            </div>
            {/* Most viewed locations section (only for logged-in users) */}
            {user && <MostViewed  mostViewed={user.mostViewed}  />}
        </div>

    );
};

export default WeatherCard;
