import { useState } from "react";
import api from "../services/api";

function DoctorAvailability() {

    const doctorId =
        localStorage.getItem("doctorId");

    const doctorName =
        localStorage.getItem("doctorName");

    console.log(
        "doctorId from localStorage:",
        doctorId
    );

    console.log(
        "doctorName from localStorage:",
        doctorName
    );

    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [slots, setSlots] = useState([]);

    const generateSlots = () => {

        if (!date) {
            alert("Please select a date");
            return;
        }

        if (!startTime || !endTime) {
            alert("Please select start and end time");
            return;
        }

        const generatedSlots = [];

        let current =
            new Date(`2026-01-01T${startTime}`);

        const end =
            new Date(`2026-01-01T${endTime}`);

        while (current <= end) {

            generatedSlots.push({
                time: current
                    .toTimeString()
                    .slice(0, 5),
                selected: false
            });

            current.setMinutes(
                current.getMinutes() + 10
            );
        }

        setSlots(generatedSlots);
    };

    const toggleSlot = (index) => {

        const updatedSlots = [...slots];

        updatedSlots[index].selected =
            !updatedSlots[index].selected;

        setSlots(updatedSlots);
    };

    const saveAvailability = async () => {

        console.log(
            "Doctor ID:",
            doctorId
        );

        console.log(
            "Doctor Name:",
            doctorName
        );

        try {

            const selectedSlots =
                slots.filter(
                    slot => slot.selected
                );

            if (selectedSlots.length === 0) {

                alert(
                    "Please select at least one slot"
                );

                return;
            }

            for (const slot of selectedSlots) {

                const payload = {

                    doctorId:
                        Number(doctorId),

                    doctorName:
                        doctorName,

                    date:
                        date,

                    slotTime:
                        slot.time,

                    available:
                        true
                };

                console.log(
                    "Sending Payload:",
                    payload
                );

                await api.post(
                    "/availability",
                    payload
                );
            }

            alert(
                "Availability Saved Successfully"
            );

            setDate("");
            setStartTime("");
            setEndTime("");
            setSlots([]);

        } catch (error) {

            console.error(error);

            console.log(
                error.response
            );

            alert(
                "Failed To Save Availability"
            );
        }
    };

    return (

        <div className="availability-container">

            <h2>
                Welcome {doctorName}
            </h2>

            <h3>
                Manage Availability
            </h3>

            <input
                type="date"
                value={date}
                onChange={(e) =>
                    setDate(e.target.value)
                }
            />

            <input
                type="time"
                value={startTime}
                onChange={(e) =>
                    setStartTime(e.target.value)
                }
            />

            <input
                type="time"
                value={endTime}
                onChange={(e) =>
                    setEndTime(e.target.value)
                }
            />

            <button
                onClick={generateSlots}
            >
                Generate Slots
            </button>

            <div className="slots-grid">

                {slots.map((slot, index) => (

                    <button
                        key={index}
                        type="button"
                        onClick={() =>
                            toggleSlot(index)
                        }
                        style={{
                            backgroundColor:
                                slot.selected
                                    ? "#1976d2"
                                    : "#ffffff",

                            color:
                                slot.selected
                                    ? "#ffffff"
                                    : "#1976d2",

                            border:
                                "2px solid #1976d2",

                            borderRadius:
                                "8px",

                            padding:
                                "10px 15px",

                            margin:
                                "5px",

                            cursor:
                                "pointer"
                        }}
                    >
                        {slot.time}
                    </button>

                ))}

            </div>

            {slots.length > 0 && (

                <button
                    onClick={saveAvailability}
                    style={{
                        marginTop: "20px"
                    }}
                >
                    Save Availability
                </button>

            )}

        </div>
    );
}

export default DoctorAvailability;