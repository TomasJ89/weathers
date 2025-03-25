export const getWindDirection = (degree) => {
    if (degree >= 0 && degree < 22.5) return { dir: "N", rotation: 0 };
    if (degree >= 22.5 && degree < 67.5) return { dir: "NE", rotation: 45 };
    if (degree >= 67.5 && degree < 112.5) return { dir: "E", rotation: 90 };
    if (degree >= 112.5 && degree < 157.5) return { dir: "SE", rotation: 135 };
    if (degree >= 157.5 && degree < 202.5) return { dir: "S", rotation: 180 };
    if (degree >= 202.5 && degree < 247.5) return { dir: "SW", rotation: 225 };
    if (degree >= 247.5 && degree < 292.5) return { dir: "W", rotation: 270 };
    if (degree >= 292.5 && degree < 337.5) return { dir: "NW", rotation: 315 };
    return { dir: "N", rotation: 0 };
};