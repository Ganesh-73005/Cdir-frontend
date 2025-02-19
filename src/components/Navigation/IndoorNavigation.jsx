import React, { useState } from "react";

const floorPlan = [
    ["Room 1", "Room 2", "Room 3"],
    ["Room 4", "Room 5", "Room 6"],
    ["Room 7", "Room 8", "Room 9"],
];

const IndoorNavigation = () => {
    const [currentRoom, setCurrentRoom] = useState("Room 1");

    const handleMove = (direction) => {
        // Logic to move between rooms
    };

    return (
        <div>
            <h3>Current Room: {currentRoom}</h3>
            <button onClick={() => handleMove("up")}>Up</button>
            <button onClick={() => handleMove("down")}>Down</button>
            <button onClick={() => handleMove("left")}>Left</button>
            <button onClick={() => handleMove("right")}>Right</button>
        </div>
    );
};

export default IndoorNavigation;