import React from 'react';
import {getWeatherIcon} from "../utils/getWeatherIcon.jsx";

function HourForecast({weather}) {
    return (
        <div>
            <h3 className="text-lg font-semibold mt-6 mb-4">5-hour forecast</h3>
            <ul className="space-y-2">
                {/* Header row with icons representing time, temperature, and wind */}
                <li className="flex items-center justify-between">
                    <img
                        src={`/icons/wi-time-5.svg`}
                        alt="Weather forecast icon"
                        className="w-4 h-4"
                    />
                    <img
                        src={`/icons/wi-thermometer.svg`}
                        alt="Weather forecast icon"
                        className="w-4 h-4"
                    />
                    <img
                        src={`/icons/wi-strong-wind.svg`}
                        alt="Weather forecast icon"
                        className="w-4 h-4"
                    />
                    <span></span>
                </li>
                {weather.hourly.time
                    .map((time, index) => ({
                        time: new Date(time),
                        temperature: weather.hourly.temperature_2m[index],
                        weatherCode: weather.hourly.weather_code[index],
                        wind: weather.hourly.wind_speed_10m[index],
                    }))
                    .filter(({ time }) => time >= new Date(weather.current.time)) // Filter from current time
                    .slice(0, 5) // Take the next 5 hours
                    .map(({ time, temperature, weatherCode,wind }, index) => (
                        <li key={index} className="flex items-center justify-between">
                            {/* Display the time in 24-hour format */}
                                    <span className="text-sm text-gray-500">
                                        {time.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                                    </span>
                            {/* Show temperature with appropriate sign */}
                            <span className="text-sm font-medium">{temperature >= 0 ? `+${temperature}` : temperature}°C</span>
                            {/* Display wind speed converted from km/h to m/s */}
                            <span className="text-sm font-medium">{(wind / 3.6).toFixed(1)} m/s</span>
                            {/* Weather icon based on weather code */}
                            <img
                                src={`/icons/${getWeatherIcon(weatherCode, weather.current.is_day)}.svg`}
                                alt="Weather forecast icon"
                                className="w-8 h-8"
                            />
                        </li>
                    ))}
            </ul>
        </div>
    );
}

export default HourForecast;