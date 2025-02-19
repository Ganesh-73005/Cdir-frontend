"use client"

import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { motion } from "framer-motion"
import { StateContext } from '../../context/StateContext'; // Use curly braces for named exports
import { SERVER_URL } from "../../config"

const Register = () => {
    const navigate = useNavigate()
    const { setLoading } = useContext(StateContext)
    const [formData, setFormData] = useState({
        name: "",
        email_address: "",
        password: "",
        phone_number: "",
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const validateForm = () => {
        if (!formData.name || !formData.email_address || !formData.password || !formData.phone_number) {
            alert("All fields are required")
            return false
        }

        if (formData.password.length < 6) {
            alert("Password must be at least 6 characters long")
            return false
        }

        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateForm()) return

        setLoading(true)
        try {
            const { data } = await axios.post(`${SERVER_URL}/api/register`, formData)

            localStorage.setItem("user", JSON.stringify(data))
            console.log(data)

            setFormData({
                name: "",
                email_address: "",
                password: "",
                phone_number: "",
            })

            navigate("/login")
        } catch (err) {
            console.error(err)

            if (err.response) {
                alert(err.response.data.error || "Registration failed")
            } else {
                alert("An error occurred during registration")
            }
        }
        setLoading(false)
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8"
            >
                <motion.h1
                    className="text-5xl text-center font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    CDirect
                </motion.h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <motion.input
                        className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 transition-all duration-300"
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        autoComplete="off"
                        whileFocus={{ scale: 1.02 }}
                    />

                    <motion.input
                        className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 transition-all duration-300"
                        type="email"
                        name="email_address"
                        placeholder="Email Address"
                        value={formData.email_address}
                        onChange={handleChange}
                        autoComplete="off"
                        whileFocus={{ scale: 1.02 }}
                    />

                    <motion.input
                        className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 transition-all duration-300"
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        autoComplete="off"
                        whileFocus={{ scale: 1.02 }}
                    />

                    <motion.input
                        className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 transition-all duration-300"
                        type="tel"
                        name="phone_number"
                        placeholder="Phone Number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        autoComplete="off"
                        whileFocus={{ scale: 1.02 }}
                    />

                    <motion.button
                        type="submit"
                        className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl text-lg font-bold hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Register
                    </motion.button>
                </form>

                <motion.button
                    onClick={() => navigate("/login")}
                    className="w-full mt-4 text-center font-medium text-blue-600 hover:text-purple-600 transition-colors duration-300"
                    whileHover={{ scale: 1.02 }}
                >
                    Already have an account? Login Here
                </motion.button>
            </motion.div>
        </div>
    )
}

export default Register

