import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";

function BookAppointment() {

    const [searchParams] = useSearchParams();

    const selectedDoctorId =
        searchParams.get("doctorId") || "";

    const [selectedDoctor, setSelectedDoctor] = useState(null);

    const [availableSlots, setAvailableSlots] =
        useState([]);

    const [appointment, setAppointment] = useState({
        doctorId: "",
        doctorName: "",
        patientName: "",
        phoneNumber: "",
        userEmail: "",
        appointmentDate: "",
        appointmentTime: "",
        reason: "",
        status: "PENDING"
    });

    useEffect(() => {

        api.get("/doctors")
            .then((response) => {

                const doctor = response.data.find(
                    (doc) =>
                        Number(doc.id) ===
                        Number(selectedDoctorId)
                );

                if (doctor) {

                    setSelectedDoctor(doctor);

                    setAppointment(prev => ({
                        ...prev,
                        doctorId: doctor.id,
                        doctorName: doctor.name
                    }));
                }
            })
            .catch((error) => {
                console.error(error);
            });

    }, [selectedDoctorId]);

    useEffect(() => {

        const userEmail =
            localStorage.getItem("userEmail");

        if (userEmail) {

            api.get(`/users/email/${userEmail}`)
                .then((response) => {

                    setAppointment(prev => ({
                        ...prev,
                        patientName:
                            response.data.name,
                        phoneNumber:
                            response.data.phoneNumber,
                        userEmail:
                            response.data.email
                    }));
                })
                .catch((error) => {
                    console.error(error);
                });
        }

    }, []);

    const fetchAvailableSlots = async (
        selectedDate
    ) => {

        try {

            const response = await api.get(
                `/availability/doctor/${selectedDoctorId}/${selectedDate}`
            );

            setAvailableSlots(response.data);

        } catch (error) {

            console.error(error);

            setAvailableSlots([]);
        }
    };

    const handleChange = (e) => {

        const { name, value } = e.target;

        setAppointment({
            ...appointment,
            [name]: value
        });

        if (name === "appointmentDate") {

            fetchAvailableSlots(value);
        }
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response =
                await api.post(
                    "/appointments",
                    appointment
                );

            console.log(response.data);

            alert(
                "Appointment Request Sent Successfully"
            );

            setAppointment(prev => ({
                ...prev,
                appointmentDate: "",
                appointmentTime: "",
                reason: "",
                status: "PENDING"
            }));

            setAvailableSlots([]);

        } catch (error) {

            console.error(error);

            alert(
                "Failed To Book Appointment"
            );
        }
    };

    return (

        <div className="booking-card">

            <div className="booking-header">

                <h2>
                    📅 Book Appointment
                </h2>

                {selectedDoctor && (
                    <>
                        <h3>
                            👨‍⚕️ {selectedDoctor.name}
                        </h3>

                        <p>
                            {selectedDoctor.specialization}
                        </p>
                    </>
                )}

            </div>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="patientName"
                    value={appointment.patientName}
                    readOnly
                />

                <input
                    type="tel"
                    name="phoneNumber"
                    value={appointment.phoneNumber}
                    readOnly
                />

                <input
                    type="text"
                    name="reason"
                    placeholder="Reason For Visit"
                    value={appointment.reason}
                    onChange={handleChange}
                    required
                />

                <input
                    type="date"
                    name="appointmentDate"
                    value={appointment.appointmentDate}
                    onChange={handleChange}
                    required
                />

                <div
                    style={{
                        marginTop: "15px"
                    }}
                >

                    <h4>
                        Available Slots
                    </h4>

                    {availableSlots.length === 0 ? (

                        <p>
                            No Slots Available
                        </p>

                    ) : (

                        availableSlots.map(
                            (slot) => (

                                <button
                                    key={slot.id}
                                    type="button"
                                    onClick={() =>
                                        setAppointment(
                                            prev => ({
                                                ...prev,
                                                appointmentTime:
                                                    slot.slotTime
                                            })
                                        )
                                    }
                                    style={{
                                        margin: "5px",
                                        padding:
                                            "10px",
                                        border:
                                            "1px solid #1976d2",
                                        borderRadius:
                                            "5px",
                                        cursor:
                                            "pointer"
                                    }}
                                >
                                    {slot.slotTime}
                                </button>
                            )
                        )
                    )}

                </div>

                <p>
                    Selected Slot:
                    {" "}
                    {appointment.appointmentTime}
                </p>

                <button
                    className="book-btn"
                    type="submit"
                >
                    Confirm Appointment
                </button>

            </form>

        </div>
    );
}

export default BookAppointment;