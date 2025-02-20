import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { motion} from "framer-motion";

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI("AIzaSyCSJWkgLJxmlVyPRxzinCueAXugCxXjM9Q"); // Replace with your actual key

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([{ text: "Hello! How can I assist you today?", sender: "bot" }]);
    const [input, setInput] = useState("");

    const handleSendMessage = async () => {
        if (input.trim() === "") return;

        // Add user message
        setMessages((prev) => [...prev, { text: input, sender: "user" }]);
        setInput("");

        try {
            const contextMessage = `provided you : {
  "IT": {
    "Name": "Information Science and Technology",
    "Courses offered": "B.Tech IT, M.Tech IT, M.Sc",
    "HOD": "Dr.S.Swamynathan",
    "No. of Staffs": "40",
    "No of UG students": "506",
    "No of PG students": "367",
    "Projects": "https://www.auegov.ac.in/Department/ist/projects",
    "Official page": "https://www.auegov.ac.in/Department/ist/",
    "Students Association": "https://istaceg.in/",
    "coords": { "lat": 13.012947868170329, "lng": 80.23592575982393}
  },
  "CSE": {
    "Name": "Computer Science and Engineering",
    "Courses offered": "B.Tech CSE, M.Tech CSE, Ph.D",
    "HOD": "Dr.R.Ravi",
    "No. of Staffs": "50",
    "No of UG students": "600",
    "No of PG students": "400",
    "Projects": "https://www.auegov.ac.in/Department/cse/projects",
    "Official page": "https://www.auegov.ac.in/Department/cse/",
    "Students Association": "https://cseaceg.in/",
    "coords": { "lat": 13.012508310836358, "lng": 80.23578625609917}
  },
  "EEE": {
    "Name": "Electrical and Electronics Engineering",
    "Courses offered": "B.E EEE, M.Tech Power Systems",
    "HOD": "Dr.K.Karthikeyan",
    "No. of Staffs": "45",
    "No of UG students": "480",
    "No of PG students": "350",
    "Projects": "https://www.auegov.ac.in/Department/eee/projects",
    "Official page": "https://www.auegov.ac.in/Department/eee/",
    "Students Association": "https://eeeaceg.in/",
    "coords":{"lat": 13.011747781599906,"lng":80.23440886896246}
  },
  "ECE": {
    "Name": "Electrical and Communication Engineering",
    "Courses offered": "B.E ECE,B.E BME, M.E Applied Electronics, Medical Electronics, VlSI Design, Communication System, Bio Medical Engineering",
    "HOD": "Dr.M.A. Bhagyaveni",
    "No. of Staffs": "23",
    "No of UG students": "768",
    "No of PG students": "176",
    "Projects": "https://www.auegov.ac.in/Department/ece/projects",
    "Official page": "https://www.auegov.ac.in/Department/ece/",
    "Students Association": "https://eceaceg.in/",
    "coords": { "lat": 13.012607327382172, "lng": 80.2352403068722}

  },
  "Civil": {
    "Name": "Civil Engineering",
    "Courses offered": "B.E Civil Engineering, Geo Informatics, Civil Engineering (TM), M.E Remote Sensing and Geomatics, Construction Engineering and Management, Environmental Engineering",
    "HOD": "Dr. S. Kanmani",
    "No. of Staffs": "58",
    "No of UG students": "355",
    "No of PG students": "152",
    "Projects": "https://www.auegov.ac.in/Department/civil/projects",
    "Official page": "https://www.auegov.ac.in/Department/civil/",
    "Students Association": "https://civilaceg.in/",
    "coords": { "lat": 13.010569333768238 , "lng": 80.2336490569835} 
  },
  "Mech": {
    "Name": "Mechanical Engineering",
    "Courses offered": "B.E Mechanical Engineering, Materials Science and Engineering, Mechanical Engineering(TM), M.E Mobility Engineering, Solar engineering, Energy engineering",
    "HOD": "Dr.R.Saravanan",
    "No. of Staffs": "55",
    "No of UG students": "691",
    "No of PG students": "138",
    "Projects": "https://www.auegov.ac.in/Department/mech/projects",
    "Official page": "https://www.auegov.ac.in/Department/mech/",
    "Students Association": "https://mechaceg.in/",
    "coords":{"lat": 13.011444633933607,"lng":  80.23259569561863}
  },
  "Manuf": {
    "Name": "Manufacturing Engineering",
    "Courses offered": "B.E Manuf, M.E Computer integrated Manufacturing",
    "HOD": "Dr.M.Omkumar",
    "No. of Staffs": "9",
    "No of UG students": "219",
    "No of PG students": "13",
    "Projects": "https://www.auegov.ac.in/Department/manuf/projects",
    "Official page": "https://www.auegov.ac.in/Department/manuf/",
    "Students Association": "https://manufaceg.in/",
    "coords": { "lat": 13.012060617139763, "lng": 80.23450949264334}
  },
  "Indus": {
    "Name": "Industrial Engineering",
    "Courses offered": "B.E IE, M.E IE, Quality Engineering and Management",
    "HOD": "Dr.R.Dillibabu",
    "No. of Staffs": "5",
    "No of UG students": "194",
    "No of PG students": "54",
    "Projects": "https://www.auegov.ac.in/Department/indus/projects",
    "Official page": "https://www.auegov.ac.in/Department/indus/",
    "Students Association": "https://indusaceg.in/",
    "coords":{"lat":13.010081641702346 ,"lng": 80.23409640718137}
  },
  "Mining": {
    "Name": "Mining Engineering",
    "Courses offered": "B.E Mining Engineering",
    "HOD": "Dr.P.Balamadeswaran",
    "No. of Staffs": "3",
    "No of UG students": "104",
    "Projects": "https://www.auegov.ac.in/Department/mining/projects",
    "Official page": "https://www.auegov.ac.in/Department/mining/",
    "Students Association": "https://miningaceg.in/",
    "coords":{"lat": 13.012829274046572 ,"lng":80.2343591956187}

  },
  "Library": {
    "Name": "Library",
    "Official page": "https://ceg.annauniv.edu/library.html",
    "Floors":3,
    "Facilities": "A/C Reading Halls for Reference, text books and current periodicals, Book Bank (SC/ST), Career Guidance Section, Digital Knowledge Centre (DKC), Inter Library Network, Kiosk for Self - Book Lending, OPAC (On-line Public Access Catalogue), Own Book Reading Hall, Provision for Self - Study Materials (Laptop with Wi Fi), Provision of Tablets for E-Resources Access, Web Based Library Information",
    "Library Hours": "Weekdays: 8.00a.m. to 9:00p.m., Weekends & Holidays: 9:00a.m. to 4:45p.m.",
    "coords":{"lat": 13.01046364755717 ,"lng":80.23764361889154}
  },
  "ACOE": {
    "Name": "Additional Control of Examination",
    "The Addition Controller of Examination": "Dr.M.Muttharam",
    "DCOE for CEG (UG)": "Mr.S.Venugopal",
    "DCOE for CEG (PG)": "Dr.S.Sudha",
    "coords":{"lat": 13.010278409296546 ,"lng":80.23352238212775}
  },
  "Vivek Audi": {
    "Name": "Vivek Auditorium",
    "Purpose":"The main auditorium",
    "Events":"Kurukshetra , Techofes",
    "coords":{"lat": 13.011695494552693,"lng": 80.23634273794598}
  },
  "CTF": {
    "Name": "CEG Tech Forum",
    "Official Page": "https://cegtechforum.in/",
    "Contact no.": "+91 9994399409, +91 7708448227",
    "Activities": "Kurukshetra, Vyuhaa, Xceeds",
    "coords":{"lat":13.013740193085326, "lng":80.23650885143691}
  },
  "KP": {
    "Name": "Knowledge Park",
    "Courses ":"All BE BTech classes",
    "Fcailities":"Smart classes with Projectors,water and fans",
    "No. of rooms": "35",
    "coords":{"lat":13.013973572411274,"lng": 80.23518404401902}
  },
  "CARCA": {
    "Name": "Centre for Alumini Relations and Corporate Affairs",
    "Phone no.": "044 22358625",
    "Email ID": "carca@annauniv.edu",
    "Official Page": "https://alumni.annauniv.edu/index.php",
    "coords":{"lat":13.012777274708077, "lng":80.23638805201742}
  },
  "CIR": {
    "Name": "Centre for International Relations",
    "Phone no.": "+91 044 - 22358561",
    "Email ID": "director.cir@annauniv.edu",
    "Director": "Prof.R.Baskaran",
    "coords":{"lat":13.012586980655376, "lng":80.23529738212778}
  }
}
            Provide details (USER CAN ASK IN ANY LANGUAGE or natural language) 
                
Format the response clearly using bullet points and section headings.Avoid unnecessary symbols like * or -.
dont give in bold letters`;

            // Call Gemini API
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(contextMessage + input);
            const response = await result.response;
            const botMessage = response.text();

            // Add bot response
            setMessages((prev) => [...prev, { text: botMessage, sender: "bot" }]);
        } catch (error) {
            console.error("Error calling Gemini API:", error);
            setMessages((prev) => [...prev, { text: "Sorry, an error occurred. Please try again.", sender: "bot" }]);
        }
    };
    return (
        <div className="fixed bottom-10 right-10">
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="w-96 h-[500px] w-[600px] bg-white rounded-lg shadow-lg flex flex-col"
                >
                    {/* Chat Header */}
                    <div className="p-4 bg-blue-600 text-white rounded-t-lg">
                        <h2 className="text-lg font-bold">CEG Chatbot</h2>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 p-4 overflow-y-auto">
                        {messages.map((message, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className={`mb-2 ${message.sender === "user" ? "text-right" : "text-left"
                                    }`}
                            >
                                <div
                                    className={`inline-block p-2 rounded-lg ${message.sender === "user"
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-200 text-gray-800"
                                        }`}
                                >
                                    {message.text}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 border-t text-gray-800">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                            className="w-full p-2 border rounded-lg"
                            placeholder="Ask about buildings..."
                        />
                    </div>
                </motion.div>
            )}

            {/* Chatbot Toggle Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-4 bg-blue-600 text-white rounded-full shadow-lg"
            >
                {isOpen ? "✕" : "💬"}
            </motion.button>
        </div>
    );
};

export default Chatbot;
