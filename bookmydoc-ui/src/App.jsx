import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Appointments from "./pages/Appointments";
import BookAppointment from "./pages/BookAppointment";
import DoctorDetails from "./pages/DoctorDetails";
import Auth from "./pages/Auth";
import Doctors from "./pages/Doctors";
import ProtectedRoute from "./components/ProtectedRoute";
import DoctorAvailability from "./pages/DoctorAvailability";
import DoctorLogin from "./pages/DoctorLogin";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorAppointments from "./pages/DoctorAppointments";
import DoctorSlots from "./pages/DoctorSlots";
import DoctorProfile from "./pages/DoctorProfile";
function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route path="/" element={<LandingPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/auth" element={<Auth />} />

        <Route path="/doctors" element={<Doctors />} />

        <Route path="/doctors/:id" element={<DoctorDetails />} />

        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <Appointments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/book"
          element={
            <ProtectedRoute>
              <BookAppointment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor-availability"
          element={<DoctorAvailability />}
        />
        <Route
          path="/doctor-login"
          element={<DoctorLogin />}
        />

        <Route
          path="/doctor-dashboard"
          element={<DoctorDashboard />}
        />
        <Route
          path="/doctor-appointments"
          element={<DoctorAppointments />}
        />
        <Route
          path="/doctor-slots"
          element={<DoctorSlots />}
        />
        <Route
          path="/doctor-profile"
          element={<DoctorProfile />}
        />
      </Routes>


    </BrowserRouter>
  );
}

export default App;