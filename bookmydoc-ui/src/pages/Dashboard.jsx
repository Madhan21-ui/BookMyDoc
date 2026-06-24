import DashboardHero from "../dashboard_components/DashboardHero";
import QuickActions from "../dashboard_components/QuickActions";
import UpcomingAppointments from "../dashboard_components/UpcomingAppointments";
import HealthTips from "../dashboard_components/HealthTips";
import Footer from "../dashboard_components/Footer";
import ProfileCard from "../dashboard_components/ProfileCard";
function Dashboard() {
    return (
        <>
            <DashboardHero />
            <ProfileCard/>
            
            <QuickActions />
            <UpcomingAppointments />
            <HealthTips/>
            <Footer/>
        </>
    );
}

export default Dashboard;