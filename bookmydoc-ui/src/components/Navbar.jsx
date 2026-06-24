import { Link } from "react-router-dom";

function Navbar() {

    const isLoggedIn =
        localStorage.getItem("isLoggedIn") === "true";

    const isDoctorLoggedIn =
        localStorage.getItem("doctorId");

    const doctorName =
        localStorage.getItem("doctorName");

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
                background:
                    "linear-gradient(135deg, #1976d2, #42a5f5)",
                color: "white"
            }}
        >

            <Link
                to="/"
                style={{
                    color: "white",
                    textDecoration: "none"
                }}
            >
                <h2
                    style={{
                        margin: 0,
                        fontWeight: "700"
                    }}
                >
                    🏥 BookMyDoc
                </h2>
            </Link>

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
                            Slots
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

                        <span
                            style={{
                                color: "white",
                                fontWeight: "600"
                            }}
                        >
                            👨‍⚕️ {doctorName}
                        </span>

                        <button
                            onClick={handleLogout}
                            style={{
                                padding: "10px 18px",
                                fontSize: "14px",
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
                                padding: "10px 18px",
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