"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Search, MapPin, ExternalLink, ChevronRight, Building2, Globe, Map } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import {Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react";


const MapComponent = () => {
    const Tab = ({
        value,
        active,
        onClick,
        children,
    }: {
        value: string
        active: boolean
        onClick: () => void
        children: React.ReactNode
    }) => (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors duration-200 ${active
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
        >
            {children}
        </button>
    )

    // Department data
    const departments = {
        IT: {
            Name: "Information Science and Technology",
            Courses: "B.Tech IT, M.Tech IT, M.Sc",
            HOD: "Dr.S.Swamynathan",
            OfficialPage: "https://www.auegov.ac.in/Department/ist/",
            coords: { lat: 13.012947868170329, lng: 80.23592575982393 },
        },
        CSE: {
            Name: "Computer Science and Engineering",
            Courses: "B.Tech CSE, M.Tech CSE, Ph.D",
            HOD: "Dr.R.Ravi",
            OfficialPage: "https://www.auegov.ac.in/Department/cse/",
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
        // Add other departments here...
    }
    interface Department {
        Name: string
        Courses?: string
        HOD?: string
        OfficialPage?: string
        coords: { lat: number; lng: number }
        [key: string]: any
    }
    
    const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null)
    const [map, setMap] = useState<any>(null)
    const [indoorRenderer, setIndoorRenderer] = useState<any>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<"map" | "web">("map")
    const [webViewUrl, setWebViewUrl] = useState<string>("")

    useEffect(() => {
        if (!window.woosmap) {
            console.error("Woosmap SDK not loaded!")
            return
        }

        const newMap = new window.woosmap.map.Map(document.getElementById("map") as HTMLElement, {
            center: { lat: 13.01069, lng: 80.235408 },
            zoom: 20,
        })

        const conf = {
            centerMap: false,
            defaultFloor: 0,
            venue: "1",
            responsive: "desktop",
        }

        const widgetConf = {
            units: "metric",
        }

        const newIndoorRenderer = new window.woosmap.map.IndoorWidget(widgetConf, conf)
        newIndoorRenderer.setMap(newMap)

        setMap(newMap)
        setIndoorRenderer(newIndoorRenderer)
        setIsLoading(false)

        
    }, [])

    const handleSearch = (departmentKey: string) => {
        const department = departments[departmentKey as keyof typeof departments]
        if (department && map) {
            map.setCenter(department.coords)
            map.setZoom(21)
            setSelectedDepartment(departmentKey)
            if (department.OfficialPage) {
                setWebViewUrl(department.OfficialPage)
            }
        }
    }

    const filteredDepartments = Object.entries(departments).filter(([key, dept]) =>
        dept.Name.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    const DepartmentInfo = ({ department }: { department: Department }) => {
        return (
            <div className="bg-white rounded-lg shadow-lg p-6 mt-4 space-y-4 transform transition-all duration-300 hover:scale-102">
                <h3 className="text-xl font-semibold text-gray-800">{department.Name}</h3>
                {department.HOD && (
                    <div className="flex items-center gap-2 text-gray-600">
                        <Building2 size={16} />
                        <span>HOD: {department.HOD}</span>
                    </div>
                )}
                {department.OfficialPage && (
                    <a
                        href={department.OfficialPage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors duration-200"
                    >
                        <ExternalLink size={16} />
                        <span>Official Page</span>
                    </a>
                )}
            </div>
        )
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="p-4">
                {/* Back Button */}
               <Link to ="/home"> <button
                   
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
                >
                    <ArrowLeft className="w-5 h-5" /> Back
                </button> </Link></div>
            {/* Sidebar */}
            <div className="w-96 bg-white shadow-lg overflow-hidden flex flex-col">
                {/* Search Header */}
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Campus Navigator</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search departments..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Department List */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-2">
                        {filteredDepartments.map(([key, dept]) => (
                            <button
                                key={key}
                                onClick={() => handleSearch(key)}
                                className="w-full text-left p-3 rounded-lg mb-2 flex items-center justify-between transition-all duration-200 hover:bg-gray-50 transform hover:-translate-y-1 hover:shadow-md"
                            >
                                <div className="flex items-center gap-3">
                                    <MapPin
                                        size={20}
                                        className={`transition-colors duration-200 ${selectedDepartment === key ? "text-blue-500" : "text-gray-400"}`}
                                    />
                                    <span
                                        className={`transition-colors duration-200 ${selectedDepartment === key ? "text-blue-700 font-medium" : "text-gray-700"}`}
                                    >
                                        {dept.Name}
                                    </span>
                                </div>
                                <ChevronRight size={20} className="text-gray-400" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Selected Department Info */}
                <AnimatePresence>
                    {selectedDepartment && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="p-4 border-t border-gray-200 overflow-hidden"
                        >
                            <DepartmentInfo department={departments[selectedDepartment as keyof typeof departments]} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
                {/* Tab Navigation */}
                <div className="bg-white border-b border-gray-200 px-4">
                    <div className="flex space-x-4">
                        <Tab
                            value="map"
                            active={activeTab === "map"}
                            onClick={() => setActiveTab("map")}
                            className="flex items-center gap-2 px-4 py-3 border-b-2 transition-colors duration-200"
                        >
                            <Map size={16} />
                            <span>Map View</span>
                        </Tab>
                        <Tab
                            value="web"
                            active={activeTab === "web"}
                            onClick={() => setActiveTab("web")}
                            className="flex items-center gap-2 px-4 py-3 border-b-2 transition-colors duration-200"
                        >
                            <Globe size={16} />
                            <span>Web View</span>
                        </Tab>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 relative">
                    <div
                        className={`absolute inset-0 transition-opacity duration-300 ${activeTab === "map" ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                    >
                        <div id="map" className="h-full w-full" />
                    </div>
                    <div
                        className={`absolute inset-0 transition-opacity duration-300 ${activeTab === "web" ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                    >
                        {webViewUrl ? (
                            <iframe
                                src={webViewUrl}
                                className="w-full h-full border-0 shadow-lg rounded-lg"
                                title="Department Website"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full bg-gray-50">
                                <p className="text-gray-500">Select a department to view its website</p>
                            </div>
                        )}
                    </div>

                    {isLoading && (
                        <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-gray-600">Loading map...</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MapComponent

