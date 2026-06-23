import { useNavigate } from "react-router-dom";

function DoctorDashboard() {

    const navigate = useNavigate();

    const doctorName =
        localStorage.getItem("doctorName");

    return (

        <div
            style={{
                padding: "40px"
            }}
        >

            <h1>
                Welcome {doctorName}
            </h1>

            <h3>
                Doctor Dashboard
            </h3>

            <div
                style={{
                    marginTop: "30px",
                    display: "flex",
                    gap: "15px",
                    flexWrap: "wrap"
                }}
            >

                <button
                    onClick={() =>
                        navigate(
                            "/doctor-availability"
                        )
                    }
                >
                    Manage Availability
                </button>

                <button
                    onClick={() =>
                        navigate(
                            "/doctor-appointments"
                        )
                    }
                >
                    View Appointments
                </button>

                <button
                    onClick={() =>
                        navigate(
                            "/doctor-slots"
                        )
                    }
                >
                    Previous Slots
                </button>

            </div>

        </div>
    );
}

export default DoctorDashboard;