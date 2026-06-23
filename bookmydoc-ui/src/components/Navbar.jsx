import { Link } from "react-router-dom";

function Navbar() {

    const isLoggedIn =
        localStorage.getItem("isLoggedIn") === "true";

    const isDoctorLoggedIn =
        localStorage.getItem("doctorId");
    console.log(
        "doctorId = ",
        localStorage.getItem("doctorId")
    );

    console.log(
        "isDoctorLoggedIn = ",
        isDoctorLoggedIn
    );

    const handleLogout = () => {

        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userEmail");

        localStorage.removeItem("doctorId");
        localStorage.removeItem("doctorName");
        localStorage.removeItem("doctorEmail");

        alert("Logged Out Successfully");

        window.location.href = "/";
    };

    return (

        <nav
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "15px 40px",
                background: "#1976d2",
                color: "white"
            }}
        >

            <h2>
                🏥 BookMyDoc
            </h2>

            <div
                style={{
                    display: "flex",
                    gap: "20px",
                    alignItems: "center"
                }}
            >

                {isDoctorLoggedIn ? (

                    <>
                        <Link
                            to="/doctor-dashboard"
                            style={{
                                color: "white",
                                textDecoration: "none"
                            }}
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/doctor-profile"
                            style={{
                                color: "white",
                                textDecoration: "none"
                            }}
                        >
                            Profile
                        </Link>
                        <Link
                            to="/doctor-availability"
                            style={{
                                color: "white",
                                textDecoration: "none"
                            }}
                        >
                            Availability
                        </Link>

                        <Link
                            to="/doctor-appointments"
                            style={{
                                color: "white",
                                textDecoration: "none"
                            }}
                        >
                            Appointments
                        </Link>

                        <button
                            onClick={handleLogout}
                            style={{
                                padding: "8px 16px",
                                border: "none",
                                borderRadius: "8px",
                                cursor: "pointer",
                                background: "white",
                                color: "#1976d2",
                                fontWeight: "600"
                            }}
                        >
                            Logout
                        </button>
                    </>

                ) : isLoggedIn ? (

                    <>
                        <Link
                            to="/dashboard"
                            style={{
                                color: "white",
                                textDecoration: "none"
                            }}
                        >
                            Home
                        </Link>

                        <Link
                            to="/appointments"
                            style={{
                                color: "white",
                                textDecoration: "none"
                            }}
                        >
                            Appointments
                        </Link>

                        <button
                            onClick={handleLogout}
                            style={{
                                padding: "8px 16px",
                                border: "none",
                                borderRadius: "8px",
                                cursor: "pointer",
                                background: "white",
                                color: "#1976d2",
                                fontWeight: "600"
                            }}
                        >
                            Logout
                        </button>
                    </>

                ) : (

                    <>
                        <Link
                            to="/"
                            style={{
                                color: "white",
                                textDecoration: "none"
                            }}
                        >
                            Home
                        </Link>

                        <Link
                            to="/doctors"
                            style={{
                                color: "white",
                                textDecoration: "none"
                            }}
                        >
                            Doctors
                        </Link>

                        <Link
                            to="/auth"
                            style={{
                                color: "white",
                                textDecoration: "none",
                                fontWeight: "600"
                            }}
                        >
                            Get Started
                        </Link>

                        <Link
                            to="/doctor-login"
                            style={{
                                color: "white",
                                textDecoration: "none",
                                fontWeight: "600"
                            }}
                        >
                            Doctor Login
                        </Link>
                    </>

                )}

            </div>

        </nav>
    );
}

export default Navbar;