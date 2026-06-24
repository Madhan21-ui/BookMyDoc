import { useState } from "react";
import api from "../services/api";
import "../style/DoctorLogin.css";

function DoctorLogin() {

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

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            const response = await api.post(
                "/doctors/login",
                loginData
            );

            if (response.data) {

                localStorage.setItem(
                    "doctorId",
                    response.data.id
                );

                localStorage.setItem(
                    "doctorName",
                    response.data.name
                );

                localStorage.setItem(
                    "doctorEmail",
                    response.data.email
                );

                alert(
                    "Doctor Login Successful"
                );

                window.location.href =
                    "/doctor-dashboard";
            }

        } catch (error) {

            console.error(error);

            alert(
                "Invalid Email Or Password"
            );
        }
    };

    return (

        <div className="doctor-login-container">

            <div className="doctor-login-card">

                <div className="doctor-icon">
                    👨‍⚕️
                </div>

                <h2>
                    Doctor Login
                </h2>

                <p>
                    Access your dashboard and manage appointments
                </p>

                <form
                    onSubmit={handleLogin}
                    className="doctor-login-form"
                >

                    <input
                        type="email"
                        name="email"
                        placeholder="Enter Email"
                        value={loginData.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Enter Password"
                        value={loginData.password}
                        onChange={handleChange}
                        required
                    />

                    <button type="submit">
                        Login
                    </button>

                </form>

            </div>

        </div>
    );
}

export default DoctorLogin;