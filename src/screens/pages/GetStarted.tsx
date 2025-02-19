import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { About } from '../../components/About'
import { Navbar } from '../../components/Navbar'
import { Hero } from '../../components/Hero'
import { Sponsors } from '../../components/Sponsors'
import { HowItWorks } from '../../components/HowItWorks'
import { FAQ } from '../../components/FAQ'
import { Footer } from '../../components/Footer'
const GetStarted = () => {
    const navigate = useNavigate();

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-black-400 to-purple-500 flex flex-col items-center justify-center p-4">
            <Navbar />
            <Hero />
            <Sponsors />
            <About />
            <HowItWorks />
            <FAQ />
            <Footer />
        </div>

    );
    
};

export default GetStarted;
