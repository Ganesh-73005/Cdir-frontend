import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer } from "@react-google-maps/api";


const mapContainerStyle = { height: "80vh", width: "100%" };
const defaultCenter = { lat: 13.0105, lng: 80.2337 };
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; // Replace with your actual API Key

const locations = {
  "Main Gate": { coords: { lat: 13.008305, lng: 80.235070 }, color: "red" },
  "Red Building": { coords: { lat: 13.010813, lng: 80.235371 }, color: "blue" },
  "Library": { coords: { lat: 13.010457, lng: 80.237720 }, color: "green" },
  "Canteen": { coords: { lat: 13.008802, lng: 80.237891 }, color: "orange" },
  "Vaagai Hostel": { coords: { lat: 13.014646, lng: 80.237921 }, color: "purple" },
  "Hostel Office": { coords: { lat: 13.014202, lng: 80.238774 }, color: "pink" },
  "Senior Non Veg Mess": { coords: { lat: 13.015559, lng: 80.238096 }, color: "yellow" },
  "Junior Veg and Non veg Mess": { coords: { lat: 13.01361118678737, lng: 80.23375590275195}, color:"yellow"},
  "Chlorophyl" : { coords: { lat: 13.013336541645947, lng: 80.233276752668}, color:"lightblue"},
  "Aambal Hostel" : { coords: { lat: 13.013979250909964, lng: 80.2345068434061}, color:"lightblue"},
  "Kurunji Hostel" : { coords : { lat : 13.013725840621532, lng: 80.23446100789204}, color:"black"},
  "Anicham Hostel" : { coords: { lat: 13.013521724576394, lng: 80.2344519972839}, color:"purple"},
  "Chemparuthi Hostel" : { coords: { lat: 13.013078315087208, lng: 80.23438571115703}, color:"lavender"},
  "Knowledge Park" : { coords: { lat: 13.013820087133478, lng: 80.23514216364377}, color:"grey"},
  "Lavender International Hostel" : { coords: { lat: 13.014649133508863, lng: 80.23535066781949}, color:"blue"},
  "Alumni Centre (AACEG)" : { coords: { lat: 13.013146823432404, lng: 80.23647168050277}, color:"green"},
  "Department of Information Science and Technology (DIST)" : { coords: { lat: 13.012947868170329, lng: 80.23592575982393}, color:"yellow"},
  "Department of Electronics and Communication Engineering" : { coords: { lat: 13.012607327382172, lng: 80.2352403068722}, color:"red"},
  "Power System and Engineering" : { coords: { lat: 13.012947381600474, lng: 80.23529138256083}, color:"darkblue"},
  "Swimming Pool" : { coords: { lat: 13.011765483797708, lng: 80.23502749161969}, color:"green"},
  "Department of Mathematics" : { coords: { lat: 13.011388104724086, lng: 80.2354744036597}, color:"pink"},
  "CEG Tech Forum (CTF)" : { coords: { lat: 13.013569393892928, lng: 80.23656229768231}, color:"purple"},
  "Ladies Hostel" : { coords: { lat: 13.013038366888289, lng: 80.23688797176526}, color:"orange"},
  "Department of Management Studies" : { coords: { lat: 13.012645472246932, lng: 80.236470648653}, color:"lightgreen"},
  "Department of Applied Chemistry" : { coords: { lat: 13.012059755104472, lng: 80.2361267174209}, color:"lightblue"},
  "Department of Science and Humanities" : { coords: { lat: 13.012236108953353, lng: 80.23558069609695}, color:"megenda"},
  "Department of Physics and Chemistry" : { coords: { lat: 13.012134215635447, lng: 80.23556661819953}, color:"blue"},
  "Vivekananda Auditorium" : { coords: { lat: 13.011534800839803, lng: 80.23635875948646}, color:"pink"},
  "State Bank ATM" : { coords: { lat: 13.010933981338486, lng: 80.236521924559}, color:"red"},
  "Ramanujan Computing Centre (RCC)" : { coords: { lat: 13.010616028824678, lng: 80.23720271676645}, color:"purple"},
  "CEG Square" : { coords: { lat: 13.010493233259853, lng: 80.23647241241709}, color:"green"},
  "AUFRG" : { coords: { lat: 13.010406618496829, lng: 80.23717008375259}, color:"grey"},
  "YRC Control Room" : { coords: { lat: 13.011373632249516, lng: 80.2361877174896}, color:"lightgreen"},
  "Department of Computer Science and Engineering" : { coords: { lat: 13.012508310836358, lng: 80.23578625609917}, color:"blue"},
  "Anna University Ground" : { coords: { lat: 13.012507314489348, lng: 80.2373135281238}, color:"pink"},
  "Manufacturing Engineering" : { coords: { lat: 13.012060617139763, lng: 80.23450949264334}, color:"purple"},
  "Tag Auditorium" : { coords: { lat: 13.011467678332918, lng: 80.23305767088478}, color:"silver"}
};

const CollegeMap = () => {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: API_KEY,
        libraries: ["places"],
    });

    const [userLocation, setUserLocation] = useState(null);
    const [source, setSource] = useState("");
    const [destination, setDestination] = useState("");
    const [directions, setDirections] = useState(null);
    const [isHovered, setIsHovered] = useState(null);
    const [isNavigating, setIsNavigating] = useState(false);
    const [voiceInstructions, setVoiceInstructions] = useState("");
    const intervalRef = useRef(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
            },
            (error) => console.error("Error fetching location:", error),
            { enableHighAccuracy: true }
        );
    }, []);

    const updateRoute = () => {
        if (!source || !destination) return;

        const srcCoords = source === "Current Location" ? userLocation : locations[source]?.coords;
        const destCoords = locations[destination]?.coords;

        if (!srcCoords || !destCoords) return;

        const directionsService = new window.google.maps.DirectionsService();
        directionsService.route(
            {
                origin: srcCoords,
                destination: destCoords,
                travelMode: window.google.maps.TravelMode.WALKING,
            },
            (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    setDirections(result);
                    if (isNavigating) {
                        startNavigation(result);
                    }
                } else {
                    console.error("Error fetching directions:", status);
                }
            }
        );
    };

    const startNavigation = (directionsResult) => {
        const steps = directionsResult.routes[0].legs[0].steps;
        let currentStep = 0;

        const speak = (text) => {
            const utterance = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(utterance);
        };

        const updateStep = () => {
            if (currentStep < steps.length) {
                const instruction = steps[currentStep].instructions;
                setVoiceInstructions(instruction);
                speak(instruction);
                currentStep++;
            } else {
                clearInterval(intervalRef.current);
                setIsNavigating(false);
                speak("You have reached your destination.");
            }
        };

        intervalRef.current = setInterval(updateStep, 5000); // Update every 5 seconds
    };

    const handleStartNavigation = () => {
        setIsNavigating(true);
        updateRoute();
    };

    const handleStopNavigation = () => {
        setIsNavigating(false);
        clearInterval(intervalRef.current);
        setVoiceInstructions("");
        window.speechSynthesis.cancel();
    };

    if (!isLoaded) return (
        <div className="flex justify-center items-center h-screen">
            <p className="text-lg text-gray-600 font-medium">Loading Maps...</p>
        </div>
    );

    const buttonBaseClass = "relative overflow-hidden px-6 py-3 rounded-lg font-semibold transition-all duration-300";
    const buttonRipple = "after:content-[''] after:absolute after:w-full after:h-full after:left-0 after:top-0 after:bg-white/20 after:scale-0 hover:after:scale-100 after:transition-transform after:duration-300 after:origin-center";

    return (
        <div className="max-w-7xl mx-auto px-4 py-6 font-sans">
            <h1 className="text-4xl font-bold text-white text-center mb-8 animate-fade-in">
                College Navigation
            </h1>

            <div className="flex flex-wrap gap-4 mb-6 justify-center items-end">
                {/* Current Location Button */}
                <button
                    onClick={() => userLocation && setSource("Current Location")}
                    disabled={!userLocation}
                    onMouseEnter={() => setIsHovered('location')}
                    onMouseLeave={() => setIsHovered(null)}
                    className={`${buttonBaseClass} ${buttonRipple} transform hover:-translate-y-1 active:translate-y-0
            ${!userLocation
                            ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                            : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-blue-500/50'}`}
                >
                    Use My Current Location
                </button>

                {/* Source Selection */}
                <div className="flex flex-col min-w-[250px] group">
                    <label htmlFor="source-select" className="mb-2 text-base font-medium text-blue-300">
                        Source:
                    </label>
                    <div className="relative">
                        <select
                            id="source-select"
                            value={source}
                            onChange={(e) => setSource(e.target.value)}
                            className="w-full px-4 py-3 bg-white rounded-lg appearance-none cursor-pointer border-2 border-transparent 
                        text-gray-800 transition-all duration-300
                        hover:border-blue-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        >
                            <option value="">Select Source</option>
                            <option value="Current Location">Current Location</option>
                            {Object.keys(locations).map((place) => (
                                <option key={place} value={place}>{place}</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 
                          transition-transform duration-300 group-hover:transform group-hover:-translate-y-1">
                            ▼
                        </div>
                    </div>
                </div>

                {/* Destination Selection */}
                <div className="flex flex-col min-w-[250px] group">
                    <label htmlFor="destination-select" className="mb-2 text-base font-medium text-yellow-300">
                        Destination:
                    </label>
                    <div className="relative">
                        <select
                            id="destination-select"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            className="w-full px-4 py-3 bg-white rounded-lg appearance-none cursor-pointer border-2 border-transparent 
                        text-gray-800 transition-all duration-300
                        hover:border-yellow-400 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                        >
                            <option value="">Select Destination</option>
                            {Object.keys(locations).map((place) => (
                                <option key={place} value={place}>{place}</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 
                          transition-transform duration-300 group-hover:transform group-hover:-translate-y-1">
                            ▼
                        </div>
                    </div>
                </div>

                {/* Show Route Button */}
                <button
                    onClick={updateRoute}
                    disabled={!source || !destination}
                    onMouseEnter={() => setIsHovered('route')}
                    onMouseLeave={() => setIsHovered(null)}
                    className={`${buttonBaseClass} ${buttonRipple} transform hover:-translate-y-1 active:translate-y-0
            ${!source || !destination
                            ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                            : 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-green-500/50'}`}
                >
                    Show Route
                </button>

                {/* Start Navigation Button */}
                <button
                    onClick={handleStartNavigation}
                    disabled={!source || !destination || isNavigating}
                    onMouseEnter={() => setIsHovered('start')}
                    onMouseLeave={() => setIsHovered(null)}
                    className={`${buttonBaseClass} ${buttonRipple} transform hover:-translate-y-1 active:translate-y-0
            ${!source || !destination || isNavigating
                            ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                            : 'bg-purple-500 hover:bg-purple-600 text-white shadow-lg hover:shadow-purple-500/50'}`}
                >
                    Start Navigation
                </button>

                {/* Stop Navigation Button */}
                <button
                    onClick={handleStopNavigation}
                    disabled={!isNavigating}
                    onMouseEnter={() => setIsHovered('stop')}
                    onMouseLeave={() => setIsHovered(null)}
                    className={`${buttonBaseClass} ${buttonRipple} transform hover:-translate-y-1 active:translate-y-0
            ${!isNavigating
                            ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                            : 'bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-red-500/50'}`}
                >
                    Stop Navigation
                </button>
            </div>

            {/* Voice Instructions */}
            {voiceInstructions && (
                <div className="mt-4 p-4 bg-blue-100 rounded-lg text-blue-800">
                    <p className="font-semibold">Voice Instructions:</p>
                    <p>{voiceInstructions}</p>
                </div>
            )}

            {/* Map Container */}
            <div className="rounded-lg overflow-hidden shadow-xl transition-transform duration-300 hover:shadow-2xl">
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={defaultCenter}
                    zoom={17}
                    options={{
                        streetViewControl: false,
                        mapTypeControl: false
                    }}
                >
                    {/* Keep your existing Markers and DirectionsRenderer */}
                    {userLocation && (
                        <Marker
                            position={userLocation}
                            icon={{
                                path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
                                scale: 10,
                                fillColor: "#4285F4",
                                fillOpacity: 1,
                                strokeColor: "#FFFFFF",
                                strokeWeight: 2,
                            }}
                        />
                    )}

                    {Object.entries(locations).map(([name, data]) => (
                        <Marker
                            key={name}
                            position={data.coords}
                            title={name}
                            icon={{
                                path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
                                scale: 8,
                                fillColor: data.color,
                                fillOpacity: 1,
                                strokeWeight: 1,
                            }}
                        />
                    ))}

                    {directions && <DirectionsRenderer directions={directions} />}
                </GoogleMap>
            </div>
        </div>
    );
};

export default CollegeMap;