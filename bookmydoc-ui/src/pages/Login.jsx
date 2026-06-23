import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../style/Auth.css";
function Login() {

    const navigate = useNavigate();

    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {

        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

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

                window.location.href = "/doctors";
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

            <div className="auth-card">

                <div className="auth-left">

                    <h1>🏥 BookMyDoc</h1>

                    <p>
                        Your health, our priority.
                        Find trusted doctors and
                        manage appointments easily.
                    </p>

                    <div className="auth-features">

                        <p>✅ Verified Doctors</p>

                        <p>✅ Instant Appointment Booking</p>

                        <p>✅ Secure Healthcare Platform</p>

                        <p>✅ Available 24/7</p>

                    </div>

                </div>

                <div className="auth-right">

                    <h2>Login</h2>

                    <form onSubmit={handleSubmit}>

                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={loginData.email}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={loginData.password}
                            onChange={handleChange}
                            required
                        />

                        <button
                            className="auth-btn"
                            type="submit"
                        >
                            Login
                        </button>

                    </form>

                    <div className="auth-link">

                        Don't have an account?{" "}

                        <a href="/register">
                            Register
                        </a>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;