import React, { useState } from "react";

const ScanBuilding = () => {
    const [buildingInfo, setBuildingInfo] = useState(null);

    const handleScan = async (image) => {
        const response = await fetch("https://api.roboflow.com/your-model-endpoint", {
            method: "POST",
            body: image,
        });
        const data = await response.json();
        setBuildingInfo(data.predictions);
    };

    return (
        <div>
            <input type="file" onChange={(e) => handleScan(e.target.files[0])} />
            {buildingInfo && (
                <div>
                    <h3>Building Info:</h3>
                    <p>{buildingInfo[0].class}</p>
                </div>
            )}
        </div>
    );
};

export default ScanBuilding;