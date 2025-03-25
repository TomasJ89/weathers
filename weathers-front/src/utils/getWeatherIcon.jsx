export const getWeatherIcon = (weatherCode, isDay) => {
    switch (weatherCode) {
        case 0:
            return isDay ? "wi-day-sunny" : "wi-stars";
        case 1:
            return isDay ? "wi-day-sunny-overcast" : "wi-night-alt-partly-cloudy";
        case 2:
            return isDay ? "wi-day-cloudy" : "wi-night-alt-cloudy";
        case 3:
            return isDay ? "wi-cloudy" : "wi-cloudy";
        case 45:
            return "wi-fog";
        case 48:
            return "wi-dust";
        case 51:
            return "wi-day-sprinkle";
        case 53:
            return "wi-day-rain-wind";
        case 55:
            return "wi-rain";
        case 56:
            return "wi-day-sleet";
        case 57:
            return "wi-sleet";
        case 61:
            return isDay ? "wi-day-rain" : "wi-night-alt-rain";
        case 63:
            return isDay ? "wi-day-showers" : "wi-night-alt-showers";
        case 65:
            return isDay ? "wi-day-thunderstorm" : "wi-night-thunderstorm";
        case 66:
            return "wi-sleet-storm";
        case 67:
            return "wi-snow";
        case 71:
            return isDay ? "wi-day-snow" : "wi-night-alt-snow";
        case 73:
            return isDay ? "wi-day-snow-wind" : "wi-night-alt-snow-wind";
        case 75:
            return isDay ? "wi-day-hail" : "wi-night-hail";
        case 77:
            return "wi-snowflake-cold";
        case 80:
            return isDay ? "wi-day-showers" : "wi-night-alt-showers";
        case 81:
            return isDay ? "wi-day-storm-showers" : "wi-night-alt-storm-showers";
        case 82:
            return isDay ? "wi-day-thunderstorm" : "wi-night-thunderstorm";
        case 85:
            return isDay ? "wi-day-snow-wind" : "wi-night-snow-wind";
        case 86:
            return isDay ? "wi-day-snow-thunderstorm" : "wi-night-snow-thunderstorm";
        case 95:
            return isDay ? "wi-day-lightning" : "wi-night-alt-lightning";
        case 96:
            return isDay ? "wi-day-hail" : "wi-night-alt-hail";
        case 99:
            return isDay ? "wi-day-thunderstorm" : "wi-night-alt-thunderstorm";
        default:
            return "wi-na";
    }
};