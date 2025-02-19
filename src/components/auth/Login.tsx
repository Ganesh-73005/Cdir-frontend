import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { StateContext } from '../../context/StateContext';
import { SERVER_URL } from '../../config';

const Login = () => {
    const navigate = useNavigate();
    const { setIsLogin, setLoading } = useContext(StateContext);
    const [login, setLogin] = useState({
        email_address: "",
        password: "",
    });

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.put(`${SERVER_URL}/api/login`, login);
            localStorage.setItem("user", JSON.stringify(data));
            setLogin({ email_address: "", password: "" });
            setIsLogin(true);
            navigate("/home");
        } catch (err) {
            console.error(err);
            alert(err.response ? err.response.data : err);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 p-4">
            <div className="bg-gray-900 text-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6">
                <h1 className="text-5xl text-center font-extrabold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    CDirect
                </h1>
                <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
                <p className="text-gray-300 text-center mb-6">Please enter your login credentials</p>

                <form onSubmit={onSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Email address</label>
                        <input
                            type="email"
                            className="w-full p-4 rounded-xl bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 transition duration-300"
                            value={login.email_address}
                            onChange={(e) => setLogin({ ...login, email_address: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Password</label>
                        <input
                            type="password"
                            className="w-full p-4 rounded-xl bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 transition duration-300"
                            value={login.password}
                            onChange={(e) => setLogin({ ...login, password: e.target.value })}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl text-lg font-bold hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                    >
                        Login
                    </button>
                </form>

                <div className="flex justify-center space-x-6 mt-6">
                    <button className="text-white text-xl hover:text-blue-400 transition duration-300">
                        <i className="fab fa-facebook-f"></i>
                    </button>
                    <button className="text-white text-xl hover:text-blue-400 transition duration-300">
                        <i className="fab fa-twitter"></i>
                    </button>
                    <button className="text-white text-xl hover:text-blue-400 transition duration-300">
                        <i className="fab fa-google"></i>
                    </button>
                </div>

                <button
                    onClick={() => navigate("/register")}
                    className="w-full mt-6 text-center font-medium text-blue-300 hover:text-purple-300 transition-colors duration-300"
                >
                    New to CDirect? Register Here
                </button>
            </div>
        </div>
    );
};

export default Login;
