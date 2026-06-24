import { useNavigate } from "react-router-dom";

function DoctorDashboard() {

    const navigate = useNavigate();

    const doctorName =
        localStorage.getItem("doctorName");

    return (

        <div
            style={{
                padding: "40px",
                backgroundColor: "#f5f7fb",
                minHeight: "100vh"
            }}
        >

            <div
                style={{
                    marginBottom: "30px"
                }}
            >
                <h1
                    style={{
                        color: "#1e293b",
                        marginBottom: "10px"
                    }}
                >
                    👋 Welcome Back,
                    <br />
                    {doctorName}
                </h1>

                <p
                    style={{
                        color: "#64748b",
                        fontSize: "18px"
                    }}
                >
                    Manage your appointments and availability
                </p>
            </div>

            {/* Stats Cards */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit,minmax(220px,1fr))",
                    gap: "20px",
                    marginBottom: "40px"
                }}
            >

                <div
                    style={{
                        background: "#ffffff",
                        padding: "25px",
                        borderRadius: "16px",
                        boxShadow:
                            "0 4px 12px rgba(0,0,0,0.08)"
                    }}
                >
                    <h2>📅</h2>
                    <h3>Total Slots</h3>
                    <p
                        style={{
                            fontSize: "28px",
                            fontWeight: "bold",
                            color: "#1976d2"
                        }}
                    >
                        --
                    </p>
                </div>

                <div
                    style={{
                        background: "#ffffff",
                        padding: "25px",
                        borderRadius: "16px",
                        boxShadow:
                            "0 4px 12px rgba(0,0,0,0.08)"
                    }}
                >
                    <h2>👥</h2>
                    <h3>Appointments</h3>
                    <p
                        style={{
                            fontSize: "28px",
                            fontWeight: "bold",
                            color: "#1976d2"
                        }}
                    >
                        --
                    </p>
                </div>

                <div
                    style={{
                        background: "#ffffff",
                        padding: "25px",
                        borderRadius: "16px",
                        boxShadow:
                            "0 4px 12px rgba(0,0,0,0.08)"
                    }}
                >
                    <h2>⏳</h2>
                    <h3>Pending Requests</h3>
                    <p
                        style={{
                            fontSize: "28px",
                            fontWeight: "bold",
                            color: "#1976d2"
                        }}
                    >
                        --
                    </p>
                </div>

            </div>

            {/* Quick Actions */}

            <h2
                style={{
                    marginBottom: "20px"
                }}
            >
                Quick Actions
            </h2>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit,minmax(250px,1fr))",
                    gap: "20px"
                }}
            >

                <div
                    onClick={() =>
                        navigate(
                            "/doctor-availability"
                        )
                    }
                    style={{
                        background: "#ffffff",
                        padding: "30px",
                        borderRadius: "16px",
                        cursor: "pointer",
                        boxShadow:
                            "0 4px 12px rgba(0,0,0,0.08)"
                    }}
                >
                    <h2>📅</h2>
                    <h3>
                        Manage Availability
                    </h3>
                    <p>
                        Create and manage slots
                    </p>
                </div>

                <div
                    onClick={() =>
                        navigate(
                            "/doctor-appointments"
                        )
                    }
                    style={{
                        background: "#ffffff",
                        padding: "30px",
                        borderRadius: "16px",
                        cursor: "pointer",
                        boxShadow:
                            "0 4px 12px rgba(0,0,0,0.08)"
                    }}
                >
                    <h2>👥</h2>
                    <h3>
                        Appointments
                    </h3>
                    <p>
                        View patient requests
                    </p>
                </div>

                <div
                    onClick={() =>
                        navigate(
                            "/doctor-slots"
                        )
                    }
                    style={{
                        background: "#ffffff",
                        padding: "30px",
                        borderRadius: "16px",
                        cursor: "pointer",
                        boxShadow:
                            "0 4px 12px rgba(0,0,0,0.08)"
                    }}
                >
                    <h2>🕒</h2>
                    <h3>
                        Previous Slots
                    </h3>
                    <p>
                        Review availability history
                    </p>
                </div>

                <div
                    onClick={() =>
                        navigate(
                            "/doctor-profile"
                        )
                    }
                    style={{
                        background: "#ffffff",
                        padding: "30px",
                        borderRadius: "16px",
                        cursor: "pointer",
                        boxShadow:
                            "0 4px 12px rgba(0,0,0,0.08)"
                    }}
                >
                    <h2>👤</h2>
                    <h3>
                        My Profile
                    </h3>
                    <p>
                        Update doctor details
                    </p>
                </div>

            </div>

        </div>
    );
}

export default DoctorDashboard;