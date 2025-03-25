import React from 'react';
import {getWeatherIcon} from "../utils/getWeatherIcon.jsx";

function HourList({data}) {
    return (
        <div className="mt-4 md:min-w-[675px] xl:min-w-[744px]">
            <ul className="space-y-2">
                <li className="flex items-center justify-between p-2 text-gray-700">
                    <img src={`/icons/wi-time-5.svg`} alt="Time icon" className="w-4 h-4" />
                    <img src={`/icons/wi-thermometer.svg`} alt="Temperature icon" className="w-4 h-4" />
                    <img src={`/icons/wi-strong-wind.svg`} alt="Wind icon" className="w-4 h-4" />
                    <img src={`/icons/wi-raindrop.svg`} alt="Wind icon" className="w-4 h-4" />
                    <span></span>
                </li>
                {data.hourly.time
                    .map((time, index) => ({
                        time: new Date(time),
                        temperature: data.hourly.temperature_2m[index],
                        weatherCode: data.hourly.weather_code[index],
                        wind: data.hourly.wind_speed_10m[index],
                        precipitation: data.hourly.precipitation[index],

                    }))
                    .filter(({ time }) => time >= new Date(data.current.time))
                    .slice(0, 5)
                    .map(({ time, temperature, weatherCode, wind,precipitation }, index) => (
                        <li key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded-lg shadow-md">
                    <span className="text-sm text-gray-500">
                        {time.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                            <span className="text-sm font-medium">{temperature}°C</span>
                            <span className="text-sm font-medium">{(wind / 3.6).toFixed(1)} m/s</span>
                            <span className="text-sm font-medium">{precipitation}mm</span>
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