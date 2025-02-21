import type React from "react"
import { useEffect, useState } from "react"
import { GoogleMap, Marker, useLoadScript, InfoWindow } from "@react-google-maps/api"
import axios from "axios"
import type { Building, Locations } from "./types1"
import { Card, CardContent } from "@/components/ui/card"
const mapContainerStyle = {
    width: "100%",
    height: "600px",
};

const center = {
    lat: 13.010813,
    lng: 80.235371,
};

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
declare global {
  interface Window {
    google: any
  }
}

const MapComponent: React.FC = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  })
  const [buildings, setBuildings] = useState<Building[]>([])
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null)

  useEffect(() => {
    axios
      .get<Building[]>("https://building-manage.onrender.com/buildings")
      .then((response) => {
        setBuildings(response.data)
      })
      .catch((error) => {
        console.error("There was an error fetching the buildings!", error)
      })
  }, [])

  if (loadError) return <div className="text-red-500">Error loading maps</div>
  if (!isLoaded) return <div className="text-blue-500">Loading Maps...</div>

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar for Building List */}
      <Card className="w-full md:w-1/4 bg-gray-100 overflow-y-auto">
        <CardContent>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Buildings</h2>
          {buildings.map((building) => (
            <Card
              key={building.name}
              className="mb-4 cursor-pointer hover:bg-gray-50"
              onClick={() => setSelectedBuilding(building)}
            >
              <CardContent>
                <h3 className="text-lg font-semibold text-gray-700">{building.name}</h3>
                <p className={`text-sm font-bold ${building.state === "open" ? "text-green-500" : "text-red-500"}`}>
                  State: {building.state}
                </p>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Google Map */}
      <Card className="flex-1 relative">
        <CardContent className="p-0 h-[400px] md:h-full">
          <GoogleMap mapContainerStyle={mapContainerStyle} zoom={15} center={center}>
            {buildings.map((building) => (
              <Marker
                key={building.name}
                position={locations[building.name].coords}
                icon={{
                  path: window.google.maps.SymbolPath.CIRCLE,
                  fillColor: building.state === "open" ? "green" : "red",
                  fillOpacity: 1,
                  strokeWeight: 0,
                  scale: 10,
                }}
                onClick={() => setSelectedBuilding(building)}
              />
            ))}

            {/* InfoWindow to Show Building Details */}
            {selectedBuilding && (
              <InfoWindow
                position={locations[selectedBuilding.name].coords}
                onCloseClick={() => setSelectedBuilding(null)}
              >
                <div className="p-2">
                  <h3 className="text-lg font-semibold text-gray-800">{selectedBuilding.name}</h3>
                  <p className="text-sm text-gray-600">
                    State:{" "}
                    <span
                      className={`font-bold ${selectedBuilding.state === "open" ? "text-green-500" : "text-red-500"}`}
                    >
                      {selectedBuilding.state}
                    </span>
                  </p>
                  {selectedBuilding.capacity && (
                    <p className="text-sm text-gray-600">
                      <strong>Capacity:</strong> {selectedBuilding.capacity}
                    </p>
                  )}
                  {selectedBuilding.lastUpdated && (
                    <p className="text-sm text-gray-600">
                      <strong>Last Updated:</strong> {selectedBuilding.lastUpdated}
                    </p>
                  )}
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </CardContent>
      </Card>
    </div>
  )
}



export default MapComponent;
