import React, { useEffect, useState } from "react"
import { GoogleMap, Marker, useLoadScript, InfoWindow, DirectionsRenderer } from "@react-google-maps/api"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"
import { cn } from "@/lib/utils"
import type { Building, Locations } from "./types1"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Navigation, Loader2 } from "lucide-react"

const mapContainerStyle = {
    width: "100%",
    height: "600px",
}

const center = {
    lat: 13.010813,
    lng: 80.235371,
}

const locations: Locations = {
    "Main Gate": { coords: { lat: 13.008305, lng: 80.235070 }, color: "red" },
    "Red Building": { coords: { lat: 13.010813, lng: 80.235371 }, color: "blue" },
    "Library": { coords: { lat: 13.010457, lng: 80.237720 }, color: "green" },
    "Canteen": { coords: { lat: 13.008802, lng: 80.237891 }, color: "orange" },
    "Vaagai Hostel": { coords: { lat: 13.014646, lng: 80.237921 }, color: "purple" },
    "Hostel Office": { coords: { lat: 13.014202, lng: 80.238774 }, color: "pink" },
    "Senior Non Veg Mess": { coords: { lat: 13.015559, lng: 80.238096 }, color: "yellow" },
    "Junior Veg and Non veg Mess": { coords: { lat: 13.01361118678737, lng: 80.23375590275195 }, color: "yellow" },
    "Chlorophyl": { coords: { lat: 13.013336541645947, lng: 80.233276752668 }, color: "lightblue" },
    "Aambal Hostel": { coords: { lat: 13.013979250909964, lng: 80.2345068434061 }, color: "lightblue" },
    "Kurunji Hostel": { coords: { lat: 13.013725840621532, lng: 80.23446100789204 }, color: "black" },
    "Anicham Hostel": { coords: { lat: 13.013521724576394, lng: 80.2344519972839 }, color: "purple" },
    "Chemparuthi Hostel": { coords: { lat: 13.013078315087208, lng: 80.23438571115703 }, color: "lavender" },
    "Knowledge Park": { coords: { lat: 13.013820087133478, lng: 80.23514216364377 }, color: "grey" },
    "Lavender International Hostel": { coords: { lat: 13.014649133508863, lng: 80.23535066781949 }, color: "blue" },
    "Alumni Centre (AACEG)": { coords: { lat: 13.013146823432404, lng: 80.23647168050277 }, color: "green" },
    "Department of Information Science and Technology (DIST)": { coords: { lat: 13.012947868170329, lng: 80.23592575982393 }, color: "yellow" },
    "Department of Electronics and Communication Engineering": { coords: { lat: 13.012607327382172, lng: 80.2352403068722 }, color: "red" },
    "Power System and Engineering": { coords: { lat: 13.012947381600474, lng: 80.23529138256083 }, color: "darkblue" },
    "Swimming Pool": { coords: { lat: 13.011765483797708, lng: 80.23502749161969 }, color: "green" },
    "Department of Mathematics": { coords: { lat: 13.011388104724086, lng: 80.2354744036597 }, color: "pink" },
    "CEG Tech Forum (CTF)": { coords: { lat: 13.013569393892928, lng: 80.23656229768231 }, color: "purple" },
    "Ladies Hostel": { coords: { lat: 13.013038366888289, lng: 80.23688797176526 }, color: "orange" },
    "Department of Management Studies": { coords: { lat: 13.012645472246932, lng: 80.236470648653 }, color: "lightgreen" },
    "Department of Applied Chemistry": { coords: { lat: 13.012059755104472, lng: 80.2361267174209 }, color: "lightblue" },
    "Department of Science and Humanities": { coords: { lat: 13.012236108953353, lng: 80.23558069609695 }, color: "megenda" },
    "Department of Physics and Chemistry": { coords: { lat: 13.012134215635447, lng: 80.23556661819953 }, color: "blue" },
    "Vivekananda Auditorium": { coords: { lat: 13.011534800839803, lng: 80.23635875948646 }, color: "pink" },
    "State Bank ATM": { coords: { lat: 13.010933981338486, lng: 80.236521924559 }, color: "red" },
    "Ramanujan Computing Centre (RCC)": { coords: { lat: 13.010616028824678, lng: 80.23720271676645 }, color: "purple" },
    "CEG Square": { coords: { lat: 13.010493233259853, lng: 80.23647241241709 }, color: "green" },
    "AUFRG": { coords: { lat: 13.010406618496829, lng: 80.23717008375259 }, color: "grey" },
    "YRC Control Room": { coords: { lat: 13.011373632249516, lng: 80.2361877174896 }, color: "lightgreen" },
    "Department of Computer Science and Engineering": { coords: { lat: 13.012508310836358, lng: 80.23578625609917 }, color: "blue" },
    "Anna University Ground": { coords: { lat: 13.012507314489348, lng: 80.2373135281238 }, color: "pink" },
    "Manufacturing Engineering": { coords: { lat: 13.012060617139763, lng: 80.23450949264334 }, color: "purple" },
    "Tag Auditorium": { coords: { lat: 13.011467678332918, lng: 80.23305767088478 }, color: "silver" }
};
const MapComponent: React.FC = () => {
    const [theme, setTheme] = useState("light")
    const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null)
    const [buildings, setBuildings] = useState<Building[]>([])
    const [mapError, setMapError] = useState<string | null>(null)
    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null)
    const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null)

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    })

    useEffect(() => {
        // Fetch buildings data
        axios.get<Building[]>("https://building-manage.onrender.com/buildings")
            .then((response) => {
                setBuildings(response.data)
            })
            .catch((error) => {
                console.error("Error fetching buildings:", error)
            })

        // Get user location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    })
                },
                (error) => {
                    console.error("Error getting location:", error)
                }
            )
        }
    }, [])

    const handleBuildingSelection = async (building: Building) => {
        setSelectedBuilding(building)
        if (userLocation && building.name && locations[building.name]) {
            const directionsService = new google.maps.DirectionsService()
            try {
                const result = await directionsService.route({
                    origin: userLocation,
                    destination: locations[building.name].coords,
                    travelMode: google.maps.TravelMode.WALKING,
                })
                setDirections(result)
            } catch (error) {
                console.error("Error getting directions:", error)
            }
        }
    }

    if (loadError) return (
        <Card className="m-4">
            <CardContent>
                <div className="text-red-500">Error loading maps</div>
            </CardContent>
        </Card>
    )
    
    if (!isLoaded) return (
        <Card className="m-4">
            <CardContent>
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </CardContent>
        </Card>
    )

    return (
        <div className={cn("min-h-screen p-5 flex flex-col items-center overflow-hidden font-sans",
            theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-800")}>
            
            <motion.h1
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="text-center mb-6 text-4xl font-bold text-primary"
            >
                Campus Navigator
            </motion.h1>

            <div className="flex w-full max-w-7xl gap-5 flex-wrap justify-center">
                {/* Buildings List Card */}
                <Card className="w-full max-w-xl shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-primary">Buildings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <motion.ul className="space-y-3">
                            {buildings.map((building, index) => (
                                <motion.li
                                    key={building.name}
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="border-2 border-primary/20 p-3 rounded-md"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <div>
                                        <strong className="text-lg text-primary">{building.name}</strong>
                                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                                            <Button
                                                variant="outline"
                                                className="flex justify-between w-full p-2 text-sm items-center truncate border-primary/20"
                                            >
                                                <strong className="truncate text-primary/80">Status:</strong>
                                                <span className={cn(
                                                    "truncate max-w-[60%] text-ellipsis overflow-hidden",
                                                    building.state === "open" ? "text-green-500" : "text-red-500"
                                                )}>
                                                    {building.state}
                                                </span>
                                            </Button>
                                            {building.capacity && (
                                                <Button
                                                    variant="outline"
                                                    className="flex justify-between w-full p-2 text-sm items-center truncate border-primary/20"
                                                >
                                                    <strong className="truncate text-primary/80">Capacity:</strong>
                                                    <span className="truncate max-w-[60%]">{building.capacity}</span>
                                                </Button>
                                            )}
                                        </div>
                                        <Button
                                            onClick={() => handleBuildingSelection(building)}
                                            className="mt-3 w-full bg-primary hover:bg-primary/90"
                                        >
                                            <Navigation className="mr-2 h-4 w-4" />
                                            Show Route
                                        </Button>
                                    </div>
                                </motion.li>
                            ))}
                        </motion.ul>
                    </CardContent>
                </Card>

                {/* Map Card */}
                <Card className="w-full max-w-2xl h-[600px] overflow-hidden shadow-lg">
                    <CardContent className="p-0 h-full">
                        <GoogleMap
                            mapContainerStyle={{ height: "100%", width: "100%" }}
                            zoom={15}
                            center={userLocation || center}
                            onLoad={() => setMapError(null)}
                            onError={() => setMapError("Error loading map")}
                            options={{
                                styles: theme === "dark" ? [
                                    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
                                    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
                                    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
                                ] : [],
                            }}
                        >
                            {userLocation && (
                                <Marker
                                    position={userLocation}
                                    icon={{
                                        path: google.maps.SymbolPath.CIRCLE,
                                        fillColor: "#4285F4",
                                        fillOpacity: 1,
                                        strokeWeight: 0,
                                        scale: 8,
                                    }}
                                />
                            )}
                            
                            {buildings.map((building) => (
                                <Marker
                                    key={building.name}
                                    position={locations[building.name].coords}
                                    icon={{
                                        path: google.maps.SymbolPath.CIRCLE,
                                        fillColor: building.state === "open" ? "#34D399" : "#EF4444",
                                        fillOpacity: 1,
                                        strokeWeight: 0,
                                        scale: 10,
                                    }}
                                    onClick={() => handleBuildingSelection(building)}
                                />
                            ))}

                            {selectedBuilding && locations[selectedBuilding.name] && (
                                <InfoWindow
                                    position={locations[selectedBuilding.name].coords}
                                    onCloseClick={() => setSelectedBuilding(null)}
                                >
                                    <div className="p-2">
                                        <h3 className="text-lg font-semibold text-gray-800">{selectedBuilding.name}</h3>
                                        <p className={cn(
                                            "text-sm font-bold",
                                            selectedBuilding.state === "open" ? "text-green-500" : "text-red-500"
                                        )}>
                                            {selectedBuilding.state}
                                        </p>
                                        {selectedBuilding.capacity && (
                                            <p className="text-sm text-gray-600">
                                                Capacity: {selectedBuilding.capacity}
                                            </p>
                                        )}
                                    </div>
                                </InfoWindow>
                            )}

                            {directions && <DirectionsRenderer directions={directions} />}
                        </GoogleMap>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default MapComponent
