import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { StateContext } from "./context/StateContext"; // Import the context
import GetStarted from "./screens/pages/GetStarted";
import Home from "./screens/pages/Home";
import  Login  from "./components/auth/Login";
import Register from "./components/auth/Register";
import App1 from "./components/App";

import  MapComponent from "./components/Indoor";
import BuildingDetector from "./components/Services"
import './index.css';
import './App.css';
import B_Detail from "./components/b"



// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { isLogin } = useContext(StateContext); // Using useContext to get isLogin from the context

    if (!isLogin) {
        return <Navigate to="/login" />;
    }

    return children;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<GetStarted />} />


                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/map" element={<App1 />} />

                {/* Protected Routes */}
                <Route
                    path="/home"
                    element={
                       
                            <Home />
                       
                    }
                />
                <Route
                    path="/b"
                    element={

                        <B_Detail/>

                    }
                />
                <Route
                    path="/indoor"
                    element={
                        
                            <MapComponent
                                
                            />

                       
                    }
                />
                <Route
                    path="/scan"
                    element={
                       
                            <BuildingDetector />
                       
                    }
                />

                {/* Catch all route - redirect to home if logged in, otherwise to login */}
                <Route
                    path="*"
                    element={
                       
                            <Navigate to="/home" replace />
                        
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
