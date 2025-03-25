import React from 'react';
import {getWindDirection} from "../utils/geWindDirection.jsx";// Function to determine wind direction
import {getWeatherIcon} from "../utils/getWeatherIcon.jsx";// Function to get the appropriate weather icon

function DaysGrid({data}) {
    return (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                {/* Loop through the next 5 days of weather data (excluding today) */}
                {data.daily.time.slice(1, 6).map((date, index) => {
                    const { dir, rotation } = getWindDirection(data.daily.wind_direction_10m_dominant[index]);// Get wind direction
                    return (
                        <div key={date} className="bg-gray-100 p-4 rounded-lg text-center shadow-md">
                            {/* Display the day of the week */}
                            <p className="text-gray-500 font-medium">
                                {new Date(date).toLocaleDateString(navigator.language, { weekday: "short" })}
                            </p>
                            {/* Weather icon */}
                            <img
                                src={`/icons/${getWeatherIcon(data.daily.weather_code[index], true)}.svg`}
                                alt="Orai"
                                className="w-12 h-12 mx-auto mt-2"
                            />
                            {/* Maximum temperature */}
                            <p className="text-gray-700 mt-2">Max</p>
                            <p className="text-gray-900 text-lg font-semibold">
                                {`${data.daily.temperature_2m_max[index] > 0 ? '+' : ''}${data.daily.temperature_2m_max[index]}°C`}
                            </p>
                            {/* Minimum temperature */}
                            <p className="text-gray-700 mt-2">Min</p>
                            <p className="text-gray-900 text-lg font-semibold">
                                {`${data.daily.temperature_2m_min[index] > 0 ? '+' : ''}${data.daily.temperature_2m_min[index]}°C`}
                            </p>
                            {/* Precipitation amount */}
                            <p className="text-gray-700 mt-2">Precipitation</p>
                            <p className="text-gray-500">{data.daily.precipitation_sum[index]} mm</p>
                            {/* Wind direction */}
                            <p className="text-gray-700 mt-2">Wind direction</p>
                            <div className="flex items-center justify-center gap-2 mt-2">
                                <p className="text-gray-900 text-lg font-semibold">{dir}</p>
                                <img
                                    src={`/icons/down-arrow.svg`}
                                    alt={`wind ${dir}`}
                                    className="w-4 h-4"
                                    style={{ transform: `rotate(${rotation}deg)` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
     
    );
}

export default DaysGrid;