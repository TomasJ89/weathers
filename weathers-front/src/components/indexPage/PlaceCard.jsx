import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PlaceCard({ place }) {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchWeatherData();
    }, [place]);

    const fetchWeatherData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
                params: {
                    latitude: place.lat, // Naudojame vietos platumą
                    longitude: place.lon, // Naudojame vietos ilgumą
                    hourly:
                        'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weathercode,cloudcover,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m',
                    start_date: '2025-03-19', // Galite naudoti dinamišką datą, jei norite
                    end_date: '2025-03-19', // Galite naudoti dinamišką datą, jei norite
                },
            });
            setWeatherData(response.data);
        } catch (err) {
            setError('Nepavyko gauti duomenų. Patikrinkite savo interneto ryšį arba pabandykite vėliau.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getTimeFromIndex = (index) => {
        const currentDate = new Date();
        currentDate.setHours(currentDate.getHours() + index); // Pakeičiamas laikas, pridedant valandas

        const hours = currentDate.getHours().toString().padStart(2, '0');
        const minutes = currentDate.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    return (
        <div className="card w-52 bg-base-100 shadow-sm">
            <div className="card-body">
                <div className="flex justify-between">
                    <h2 className="text-3xl font-bold">{place.name}</h2>
                </div>
                <ul className="mt-6 flex flex-col gap-2 text-xs">
                    <li>
                        <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{place.display_name}</span>
                    </li>
                </ul>
                {loading && <div>Kraunami duomenys...</div>}
                {error && <div>{error}</div>}
                {weatherData && (
                    <div className="mt-6">
                        <h3 className="font-bold text-lg">Orų prognozė</h3>
                        <ul className="mt-2">
                            {weatherData.hourly.time.slice(0, 5).map((time, index) => (
                                <li key={index} className="mt-2">
                                    <p>Laikas: {getTimeFromIndex(index)}</p>
                                    <p>Temperatūra: {weatherData.hourly.temperature_2m[index]}°C</p>
                                    <p>Santykinis drėgnumas: {weatherData.hourly.relative_humidity_2m[index]}%</p>
                                    <p>Vėjo greitis: {weatherData.hourly.wind_speed_10m[index]} m/s</p>
                                    <p>Precipitation: {weatherData.hourly.precipitation[index]} mm</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <div className="mt-6">
                    <button className="btn btn-primary btn-block">Subscribe</button>
                </div>
            </div>
        </div>
    );
}

export default PlaceCard;
