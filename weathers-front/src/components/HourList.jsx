import React from 'react';
import {getWeatherIcon} from "../utils/getWeatherIcon.jsx"; // Function to determine the correct weather icon

function HourList({data}) {
    return (
        <div className="mt-4 md:min-w-[675px] xl:min-w-[744px]">
            <ul className="space-y-2">

                {/* Header row with icons representing time, temperature, wind, and precipitation */}
                <li className="flex items-center justify-between p-2 text-gray-700">
                    <img src={`/icons/wi-time-5.svg`} alt="Time icon" className="w-4 h-4" />
                    <img src={`/icons/wi-thermometer.svg`} alt="Temperature icon" className="w-4 h-4" />
                    <img src={`/icons/wi-strong-wind.svg`} alt="Wind icon" className="w-4 h-4" />
                    <img src={`/icons/wi-raindrop.svg`} alt="Wind icon" className="w-4 h-4" />
                    <span></span> {/* Empty span for spacing */}
                </li>

                {/* Mapping through the hourly forecast data */}
                {data.hourly.time
                    .map((time, index) => ({
                        time: new Date(time),
                        temperature: data.hourly.temperature_2m[index],
                        weatherCode: data.hourly.weather_code[index],
                        wind: data.hourly.wind_speed_10m[index],
                        precipitation: data.hourly.precipitation[index],

                    }))
                    .filter(({ time }) => time >= new Date(data.current.time))// Filter out past hours
                    .slice(0, 5) // Limit results to the next 5 hours
                    .map(({ time, temperature, weatherCode, wind,precipitation }, index) => (
                        <li key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded-lg shadow-md">
                    <span className="text-sm text-gray-500">
                        {time.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                            {/* Show temperature in Celsius */}
                            <span className="text-sm font-medium">{temperature}°C</span>

                            {/* Convert wind speed from km/h to m/s and display */}
                            <span className="text-sm font-medium">{(wind / 3.6).toFixed(1)} m/s</span>

                            {/* Display precipitation amount in mm */}
                            <span className="text-sm font-medium">{precipitation}mm</span>

                            {/* Display the appropriate weather icon */}
                            <img
                                src={`/icons/${getWeatherIcon(weatherCode, data.current.is_day)}.svg`}
                                alt="Weather icon"
                                className="w-8 h-8"
                            />
                        </li>
                    ))}
            </ul>
        </div>
    );
}

export default HourList;