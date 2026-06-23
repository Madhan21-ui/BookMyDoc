import { useState } from "react";
import api from "../services/api";

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

            console.log(response.data);

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

                console.log(
                    "Saved Doctor ID:",
                    localStorage.getItem("doctorId")
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

        <div className="auth-container">

            <div className="auth-box">

                <form onSubmit={handleLogin}>

                    <h2>
                        Doctor Login
                    </h2>

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
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

                    <button type="submit">
                        Login
                    </button>

                </form>

            </div>

        </div>
    );
}

export default DoctorLogin;