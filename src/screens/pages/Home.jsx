import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSignOutAlt, FaQrcode, FaMapMarkedAlt, FaBuilding, FaDoorOpen } from "react-icons/fa";
import { MdOutlineNavigation } from "react-icons/md";
import { Card, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import cdir from "../../assets/final.png";
import { Footer } from "../../components/Footer";
import ChatBot from "../../components/Chatbot"

const serviceList = [
    {
        title: "Logout",
        description: "Don't leave us alone :(",
        icon: <FaSignOutAlt size={24} />,
        link: "/login",
    },
    {
        title: "Scan Building",
        description: "Scan and know about buildings.",
        icon: <FaQrcode size={24} />,
        link: "/scan",
    },
    {
        title: "Indoor Navigation",
        description: "Find your way inside easily.",
        icon: <MdOutlineNavigation size={24} />,
        link: "/indoor",
    },
    {
        title: "Outdoor Navigation",
        description: "Fly like a bird.",
        icon: <FaMapMarkedAlt size={24} />,
        link: "/map",
    },
    {
        title: "Building Details",
        description: "Know open or close state.",
        icon: <FaBuilding size={24} />,
        link: "/b",
    }
];

const Home = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-blue-900 to-gray-900 flex flex-col items-center justify-center p-6">
            {/* Heading */}
            <motion.h1
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-5xl font-extrabold text-white drop-shadow-lg text-center"
            >
                OUR SERVICES
            </motion.h1>

            {/* Services Section */}
            <section className="container py-24 sm:py-32">
                <div className="grid lg:grid-cols-2 gap-16 place-items-center">
                    {/* Left Side - Links */}
                    <div className="w-full">
                        <h2 className="text-3xl md:text-4xl font-bold text-white">
                            <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                                CEG-Centric{" "}
                            </span>
                            Services
                        </h2>

                        <p className="text-gray-300 text-xl mt-4 mb-8">
                            Enhance your navigation experience with smart, intuitive solutions.
                        </p>

                        <div className="flex flex-col gap-8">
                            {serviceList.map(({ icon, title, description, link }) => (
                                <Link to={link} key={title}>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="cursor-pointer"
                                    >
                                        <Card className="bg-gray-800 text-white hover:shadow-xl transition-all">
                                            <CardHeader className="flex md:flex-row justify-start items-center gap-4">
                                                <div className="bg-blue-600 p-3 rounded-2xl">{icon}</div>
                                                <div>
                                                    <CardTitle>{title}</CardTitle>
                                                    <CardDescription className="text-md mt-2 text-gray-300">
                                                        {description}
                                                    </CardDescription>
                                                </div>
                                            </CardHeader>
                                        </Card>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Right Side - Image */}
                    <div className="w-full flex justify-center">
                        <img
                            src={cdir}
                            className="w-[500px] md:w-[500px] lg:w-[700px] object-contain"
                            alt="About services"
                        />
                    </div>
                </div>
                <ChatBot/>
            </section>

            <Footer />
        </div>

    );
};

export default Home;
