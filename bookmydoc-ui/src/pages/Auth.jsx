import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../style/Auth.css";

function Auth() {

    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(false);

    const [user, setUser] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        age: "",
        bloodGroup: "",
        password: "",
        confirmPassword: "",
        verified: false
    });

    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    });

    const handleRegisterChange = (e) => {

        setUser({
            ...user,
            [e.target.name]: e.target.value
        });

    };

    const handleLoginChange = (e) => {

        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        });

    };

    const handleRegister = async (e) => {

        e.preventDefault();

        if (user.password !== user.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {

            const userData = {
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                age: user.age,
                bloodGroup: user.bloodGroup,
                password: user.password,
                verified: false
            };

            await api.post("/users", userData);

            alert("Registration Successful!");

            navigate("/");

        } catch (error) {

            console.error(error);

            alert("Registration Failed");

        }
    };

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            const response = await api.post(
                "/users/login",
                loginData
            );

            if (response.data === "Login Success") {

                localStorage.setItem(
                    "isLoggedIn",
                    "true"
                );

                localStorage.setItem(
                    "userEmail",
                    loginData.email
                );

                alert("Login Successful");

               window.location.href="/dashboard";
            } else {

                alert(response.data);

            }

        } catch (error) {

            console.error(error);

            alert("Login Failed");

        }
    };

    return (
        <div className="auth-container">

            <div className={`auth-box ${isLogin ? "active" : ""}`}>

                {/* Register Form */}

                <div className="form-container register-container">

                    <form onSubmit={handleRegister}>

                        <h2>Create Account</h2>

                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            onChange={handleRegisterChange}
                            required
                        />

                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            onChange={handleRegisterChange}
                            required
                        />

                        <input
                            type="tel"
                            name="phoneNumber"
                            placeholder="Phone Number"
                            onChange={handleRegisterChange}
                            required
                        />

                        <input
                            type="number"
                            name="age"
                            placeholder="Age"
                            onChange={handleRegisterChange}
                            required
                        />

                        <input
                            type="text"
                            name="bloodGroup"
                            placeholder="Blood Group"
                            onChange={handleRegisterChange}
                            required
                        />

                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            onChange={handleRegisterChange}
                            required
                        />

                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            onChange={handleRegisterChange}
                            required
                        />

                        <button type="submit">
                            Register
                        </button>

                    </form>

                </div>

                {/* Login Form */}

                <div className="form-container login-container">

                    <form onSubmit={handleLogin}>

                        <h2>Login</h2>

                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            onChange={handleLoginChange}
                            required
                        />

                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            onChange={handleLoginChange}
                            required
                        />

                        <button type="submit">
                            Login
                        </button>

                    </form>

                </div>

                {/* Overlay */}

                <div className="overlay-container">

                    <div className="overlay">

                        <div className="overlay-panel overlay-left">

                            <h1>🏥 BookMyDoc</h1>

                            <p>
                                Already have an account?
                            </p>

                            <button
                                className="ghost"
                                onClick={() =>
                                    setIsLogin(false)
                                }
                            >
                                Register
                            </button>

                        </div>

                        <div className="overlay-panel overlay-right">

                            <h1>🏥 BookMyDoc</h1>

                            <p>
                                Your Health, Our Priority
                            </p>

                            <button
                                className="ghost"
                                onClick={() =>
                                    setIsLogin(true)
                                }
                            >
                                Login
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Auth;