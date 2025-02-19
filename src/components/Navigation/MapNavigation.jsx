import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const buildings = {
    "Building A": { lat: 12.9716, lng: 77.5946 },
    "Building B": { lat: 12.9726, lng: 77.5956 },
};

const MapNavigation = () => {
    const [start, setStart] = useState("");
    const [destination, setDestination] = useState("");

    const handleNavigation = () => {
        // Logic to calculate route between start and destination
    };

    return (
        <div>
            <select onChange={(e) => setStart(e.target.value)}>
                {Object.keys(buildings).map((building) => (
                    <option key={building} value={building}>
                        {building}
                    </option>
                ))}
            </select>
            <select onChange={(e) => setDestination(e.target.value)}>
                {Object.keys(buildings).map((building) => (
                    <option key={building} value={building}>
                        {building}
                    </option>
                ))}
            </select>
            <button onClick={handleNavigation}>Navigate</button>

            <MapContainer center={[12.9716, 77.5946]} zoom={15}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {Object.entries(buildings).map(([name, coords]) => (
                    <Marker key={name} position={[coords.lat, coords.lng]}>
                        <Popup>{name}</Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default MapNavigation;