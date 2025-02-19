﻿"use client"

import React, { useRef, useEffect, useState } from "react"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import { GoogleMap, Marker, DirectionsRenderer, useLoadScript } from "@react-google-maps/api"
import "leaflet/dist/leaflet.css"
import { Camera, Upload, Navigation, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"



const libraries = ["places"]

interface Building {
    label: string
    confidence: number
    info: {
        [key: string]: string | number
    }
}

const BuildingDetector: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [buildingInfo, setBuildingInfo] = useState<Building[]>([])
    const [scanning, setScanning] = useState(false)
    const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null)
    const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null)
    const [uploadedImage, setUploadedImage] = useState<string | null>(null)
    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null)
    const [mapError, setMapError] = useState<string | null>(null)
    const { theme } = useTheme()

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey:  import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries,
    })

    useEffect(() => {
        startCamera()
        getUserLocation()
        const locationInterval = setInterval(getUserLocation, 5000)
        return () => clearInterval(locationInterval)
    }, [])

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true })
            if (videoRef.current) {
                videoRef.current.srcObject = stream
            }
        } catch (err) {
            console.error("Error accessing camera:", err)
        }
    }

    const getUserLocation = async () => {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(
                (position) => {
                    const newLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setUserLocation(newLocation);
                },
                (error) => {
                    console.error("Error getting user location:", error);
                },
                { enableHighAccuracy: true }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    };
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setUploadedImage(reader.result as string)
                scanImage(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const getLabelName = (label: string): string => {
        const labelMap: { [key: string]: string } = {
            "ALUMNI CENTER": "CARCA",
            CSE: "CSE",
            "Chlorophyll + delta audi": "Vivek Audi",
            ECE: "ECE",
            EEE: "EEE",
            IT: "IT",
            "Industrial Engineering": "Indus",
            LIBRARY: "Library",
            "Ocean Management Dana Berg Hall": "Mining",
            Printing: "Manuf",
            RCC: "Civil",
            "RED BUILDING": "RED BUILDING",
            "S AND H": "KP",
            Unlabeled: "Unknown",
            VIVEK_AUDI: "Vivek Audi",
        }
        return labelMap[label] || label
    }

    const scanImage = async (base64Image: string) => {
        setScanning(true)
        try {
            const response = await axios.post("https://classify.roboflow.com/campus-nav/1", base64Image, {
                params: { api_key: "AXwpMdB3TsNEHit6rI2Z" },
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            })

            const filteredPredictions = response.data.predictions
                .filter((prediction: any) => prediction.confidence * 100 > 30)
                .map((prediction: any) => ({
                    label: getLabelName(prediction.class),
                    confidence: prediction.confidence,
                    info: getBuildingInfo(prediction.class),
                }))

            setBuildingInfo(filteredPredictions)
        } catch (error) {
            console.error("Error sending frame:", error)
        } finally {
            setScanning(false)
        }
    }

    const captureFrame = async () => {
        setScanning(true)
        const video = videoRef.current
        const canvas = canvasRef.current
        if (!video || !canvas) return

        const context = canvas.getContext("2d")
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context?.drawImage(video, 0, 0, canvas.width, canvas.height)

        canvas.toBlob(async (blob) => {
            if (blob) {
                const reader = new FileReader()
                reader.readAsDataURL(blob)
                reader.onloadend = async () => {
                    const base64Image = (reader.result as string).split(",")[1]
                    scanImage(base64Image)
                }
            }
        }, "image/jpeg")
    }

    const fetchRoute = (start: google.maps.LatLngLiteral, end: google.maps.LatLngLiteral) => {
        const directionsService = new window.google.maps.DirectionsService()
        directionsService.route(
            {
                origin: start,
                destination: end,
                travelMode: window.google.maps.TravelMode.WALKING,
            },
            (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    setDirections(result)
                } else {
                    console.error(`error fetching directions ${result}`)
                }
            },
        )
    }

    const getBuildingInfo = (label: string) => {
        const mappedLabel = getLabelName(label)
        const buildingData: { [key: string]: any } = {
            IT: {
                Name: "Information Science and Technology",
                "Courses offered": "B.Tech IT, M.Tech IT, M.Sc",
                HOD: "Dr.S.Swamynathan",
                "No. of Staffs": "40",
                "No of UG students": "506",
                "No of PG students": "367",
                Projects: "https://www.auegov.ac.in/Department/ist/projects",
                "Official page": "https://www.auegov.ac.in/Department/ist/",
                "Students Association": "https://istaceg.in/",
                coords: { lat: 13.012947868170329, lng: 80.23592575982393 },
            },
            CSE: {
                Name: "Computer Science and Engineering",
                "Courses offered": "B.Tech CSE, M.Tech CSE, Ph.D",
                HOD: "Dr.R.Ravi",
                "No. of Staffs": "50",
                "No of UG students": "600",
                "No of PG students": "400",
                Projects: "https://www.auegov.ac.in/Department/cse/projects",
                "Official page": "https://www.auegov.ac.in/Department/cse/",
                "Students Association": "https://cseaceg.in/",
                coords: { lat: 13.012508310836358, lng: 80.23578625609917 },
            },
            EEE: {
                Name: "Electrical and Electronics Engineering",
                "Courses offered": "B.E EEE, M.Tech Power Systems",
                HOD: "Dr.K.Karthikeyan",
                "No. of Staffs": "45",
                "No of UG students": "480",
                "No of PG students": "350",
                Projects: "https://www.auegov.ac.in/Department/eee/projects",
                "Official page": "https://www.auegov.ac.in/Department/eee/",
                "Students Association": "https://eeeaceg.in/",
                coords: { lat: 13.011747781599906, lng: 80.23440886896246 },
            },
            ECE: {
                Name: "Electrical and Communication Engineering",
                "Courses offered":
                    "B.E ECE,B.E BME, M.E Applied Electronics, Medical Electronics, VlSI Design, Communication System, Bio Medical Engineering",
                HOD: "Dr.M.A. Bhagyaveni",
                "No. of Staffs": "23",
                "No of UG students": "768",
                "No of PG students": "176",
                Projects: "https://www.auegov.ac.in/Department/ece/projects",
                "Official page": "https://www.auegov.ac.in/Department/ece/",
                "Students Association": "https://eceaceg.in/",
                coords: { lat: 13.012607327382172, lng: 80.2352403068722 },
            },
            Civil: {
                Name: "Civil Engineering",
                "Courses offered":
                    "B.E Civil Engineering, Geo Informatics, Civil Engineering (TM), M.E Remote Sensing and Geomatics, Construction Engineering and Management, Environmental Engineering",
                HOD: "Dr. S. Kanmani",
                "No. of Staffs": "58",
                "No of UG students": "355",
                "No of PG students": "152",
                Projects: "https://www.auegov.ac.in/Department/civil/projects",
                "Official page": "https://www.auegov.ac.in/Department/civil/",
                "Students Association": "https://civilaceg.in/",
                coords: { lat: 13.010569333768238, lng: 80.2336490569835 },
            },
            Mech: {
                Name: "Mechanical Engineering",
                "Courses offered":
                    "B.E Mechanical Engineering, Materials Science and Engineering, Mechanical Engineering(TM), M.E Mobility Engineering, Solar engineering, Energy engineering",
                HOD: "Dr.R.Saravanan",
                "No. of Staffs": "55",
                "No of UG students": "691",
                "No of PG students": "138",
                Projects: "https://www.auegov.ac.in/Department/mech/projects",
                "Official page": "https://www.auegov.ac.in/Department/mech/",
                "Students Association": "https://mechaceg.in/",
                coords: { lat: 13.011444633933607, lng: 80.23259569561863 },
            },
            Manuf: {
                Name: "Manufacturing Engineering",
                "Courses offered": "B.E Manuf, M.E Computer integrated Manufacturing",
                HOD: "Dr.M.Omkumar",
                "No. of Staffs": "9",
                "No of UG students": "219",
                "No of PG students": "13",
                Projects: "https://www.auegov.ac.in/Department/manuf/projects",
                "Official page": "https://www.auegov.ac.in/Department/manuf/",
                "Students Association": "https://manufaceg.in/",
                coords: { lat: 13.012060617139763, lng: 80.23450949264334 },
            },
            Indus: {
                Name: "Industrial Engineering",
                "Courses offered": "B.E IE, M.E IE, Quality Engineering and Management",
                HOD: "Dr.R.Dillibabu",
                "No. of Staffs": "5",
                "No of UG students": "194",
                "No of PG students": "54",
                Projects: "https://www.auegov.ac.in/Department/indus/projects",
                "Official page": "https://www.auegov.ac.in/Department/indus/",
                "Students Association": "https://indusaceg.in/",
                coords: { lat: 13.010081641702346, lng: 80.23409640718137 },
            },
            Mining: {
                Name: "Mining Engineering",
                "Courses offered": "B.E Mining Engineering",
                HOD: "Dr.P.Balamadeswaran",
                "No. of Staffs": "3",
                "No of UG students": "104",
                Projects: "https://www.auegov.ac.in/Department/mining/projects",
                "Official page": "https://www.auegov.ac.in/Department/mining/",
                "Students Association": "https://miningaceg.in/",
                coords: { lat: 13.012829274046572, lng: 80.2343591956187 },
            },
            Library: {
                Name: "Library",
                "Official page": "https://ceg.annauniv.edu/library.html",
                Floors: 3,
                Facilities:
                    "A/C Reading Halls for Reference, text books and current periodicals, Book Bank (SC/ST), Career Guidance Section, Digital Knowledge Centre (DKC), Inter Library Network, Kiosk for Self - Book Lending, OPAC (On-line Public Access Catalogue), Own Book Reading Hall, Provision for Self - Study Materials (Laptop with Wi Fi), Provision of Tablets for E-Resources Access, Web Based Library Information",
                "Library Hours": "Weekdays: 8.00a.m. to 9:00p.m., Weekends & Holidays: 9:00a.m. to 4:45p.m.",
                coords: { lat: 13.01046364755717, lng: 80.23764361889154 },
            },
            ACOE: {
                Name: "Additional Control of Examination",
                "The Addition Controller of Examination": "Dr.M.Muttharam",
                "DCOE for CEG (UG)": "Mr.S.Venugopal",
                "DCOE for CEG (PG)": "Dr.S.Sudha",
                coords: { lat: 13.010278409296546, lng: 80.23352238212775 },
            },
            "Vivek Audi": {
                Name: "Vivek Auditorium",
                Purpose: "The main auditorium",
                Events: "Kurukshetra , Techofes",
                coords: { lat: 13.011695494552693, lng: 80.23634273794598 },
            },
            CTF: {
                Name: "CEG Tech Forum",
                "Official Page": "https://cegtechforum.in/",
                "Contact no.": "+91 9994399409, +91 7708448227",
                Activities: "Kurukshetra, Vyuhaa, Xceeds",
                coords: { lat: 13.013740193085326, lng: 80.23650885143691 },
            },
            KP: {
                Name: "Knowledge Park",
                "Courses ": "All BE BTech classes",
                Fcailities: "Smart classes with Projectors,water and fans",
                "No. of rooms": "35",
                coords: { lat: 13.013973572411274, lng: 80.23518404401902 },
            },
            CARCA: {
                Name: "Centre for Alumini Relations and Corporate Affairs",
                "Phone no.": "044 22358625",
                "Email ID": "carca@annauniv.edu",
                "Official Page": "https://alumni.annauniv.edu/index.php",
                coords: { lat: 13.012777274708077, lng: 80.23638805201742 },
            },
            CIR: {
                Name: "Centre for International Relations",
                "Phone no.": "+91 044 - 22358561",
                "Email ID": "director.cir@annauniv.edu",
                Director: "Prof.R.Baskaran",
                coords: { lat: 13.012586980655376, lng: 80.23529738212778 },
            },
            "RED BUILDING": {
                Name: "Red Building",
                "Phone no.": "+91 044 - 22358561",
                "Email ID": "annauniv.edu",
                Dean: "Prof.Swamynathan",
                coords: { lat: 13.01069, lng: 80.235408 },
            },
            Unknown: {
                Name: "Unknown Location",
            },
        }

        return buildingData[mappedLabel] || { Name: mappedLabel }
    }

    const handleBuildingSelection = (building: Building) => {
        setSelectedBuilding(building)
        if (userLocation && building.info.coords) {
            const coords = building.info.coords as { lat: number; lng: number }
            fetchRoute(userLocation, { lat: coords.lat, lng: coords.lng })
        }
    }

    if (loadError) return <div>Error loading maps</div>
    if (!isLoaded) return <div>Loading Maps...</div>
    if (mapError) return <div>{mapError}</div>

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
                <Card className="w-full max-w-xl mb-5 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-primary">Camera View</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="relative mb-4 border-2 border-primary/20 rounded-lg overflow-hidden"
                        >
                            {uploadedImage ? (
                                <img src={uploadedImage || "/placeholder.svg"} alt="Uploaded" className="w-full block" />
                            ) : (
                                <video ref={videoRef} autoPlay playsInline className="w-full block"></video>
                            )}
                            <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full"></canvas>
                        </motion.div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button onClick={captureFrame} disabled={scanning} className="flex-1 bg-primary hover:bg-primary/90">
                                {scanning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Camera className="mr-2 h-4 w-4" />}
                                {scanning ? "Scanning..." : "Scan"}
                            </Button>
                            <Button asChild className="flex-1 bg-secondary text-white-800 hover:bg-secondary/90">
                                <label className="cursor-pointer">
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload Image
                                    <input type="file" onChange={handleImageUpload} className="hidden" />
                                </label>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <AnimatePresence>
                    {buildingInfo.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            transition={{ duration: 0.5 }}
                            className="w-full max-w-xl mt-4"
                        >
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-primary">Detected Buildings</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3">
                                        {buildingInfo.map((building, index) => (
                                            <motion.li
                                                key={index}
                                                initial={{ opacity: 0, x: -50 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                                className="border-2 border-primary/20 p-3 rounded-md"
                                                whileHover={{ scale: 1.02 }}
                                            >
                                                <div>
                                                    <strong className="text-lg text-primary">{building.label}</strong>
                                                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                                                        {Object.entries(building.info).map(([key, value]) => {
                                                            if (key === "coords") return null
                                                            const stringValue = typeof value === "object" ? JSON.stringify(value) : String(value)
                                                            return (
                                                                <Button
                                                                    key={key}
                                                                    variant="outline"
                                                                    className="flex justify-between w-full p-2 text-sm items-center truncate border-primary/20"
                                                                >
                                                                    <strong className="truncate text-primary/80">{key}:</strong>
                                                                    <span className="truncate max-w-[60%] text-ellipsis overflow-hidden">
                                                                        {stringValue}
                                                                    </span>
                                                                </Button>
                                                            )
                                                        })}
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
                                    </ul>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>

                <Card className="w-full max-w-2xl h-[600px] overflow-hidden shadow-lg">
                    <CardContent className="p-0 h-full">
                        <GoogleMap
                            mapContainerStyle={{ height: "100%", width: "100%" }}
                            zoom={15}
                            center={userLocation || undefined}
                            onLoad={(map) => {
                                setMapError(null)
                            }}
                            onError={(error) => {
                                setMapError("Error loading map. Please check your internet connection.")
                            }}
                            options={{
                                styles: theme === "dark" ? [
                                    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
                                    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
                                    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
                                ] : [],
                            }}
                        >
                            {userLocation && <Marker position={userLocation} />}
                            {selectedBuilding && selectedBuilding.info.coords && (
                                <Marker position={selectedBuilding.info.coords as google.maps.LatLngLiteral} />
                            )}
                            {directions && <DirectionsRenderer directions={directions} />}
                        </GoogleMap>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default BuildingDetector
