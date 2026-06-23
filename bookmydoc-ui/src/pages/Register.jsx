import { useState } from "react";
import api from "../services/api";
import "../style/Auth.css";
function Register() {

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

    const handleChange = (e) => {

        setUser({
            ...user,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

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

            const response = await api.post(
                "/users",
                userData
            );

            console.log(response.data);

            alert("Registration Successful!");

            setUser({
                name: "",
                email: "",
                phoneNumber: "",
                age: "",
                bloodGroup: "",
                password: "",
                confirmPassword: "",
                verified: false
            });

        } catch (error) {

            console.error(error);

            alert("Registration Failed");

        }

    };
    return (
        <div className="auth-container">

            <div className="auth-card">

                <div className="auth-left">

                    <h1>🏥 BookMyDoc</h1>

                    <p>
                        Book appointments with trusted doctors
                        from the comfort of your home.
                    </p>

                    <div className="auth-features">

                        <p>✅ Verified Doctors</p>

                        <p>✅ Instant Appointment Booking</p>

                        <p>✅ Secure Healthcare Platform</p>

                        <p>✅ Available 24/7</p>

                    </div>

                </div>

                <div className="auth-right">

                    <h2>Create Account</h2>

                    <form onSubmit={handleSubmit}>

                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={user.name}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={user.email}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="tel"
                            name="phoneNumber"
                            placeholder="Phone Number"
                            value={user.phoneNumber}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="number"
                            name="age"
                            placeholder="Age"
                            value={user.age}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="text"
                            name="bloodGroup"
                            placeholder="Blood Group"
                            value={user.bloodGroup}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={user.password}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={user.confirmPassword}
                            onChange={handleChange}
                            required
                        />

                        <button
                            className="auth-btn"
                            type="submit"
                        >
                            Register
                        </button>

                    </form>

                    <div className="auth-link">

                        Already have an account?{" "}

                        <a href="/login">
                            Login
                        </a>

                    </div>

                </div>

            </div>

        </div>
    );

}

export default Register;