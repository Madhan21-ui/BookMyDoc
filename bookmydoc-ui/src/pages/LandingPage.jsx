import Hero from "../componentts/Hero";
import Stats from "../componentts/Stats";
import Specialities from "../componentts/Specialities";
import TopDoctors from "../componentts/TopDoctors";
import Howitworks from "../componentts/HowItWorks";
import WhyChooseUs from "../componentts/WhyChooseUs";
import Testimonials from "../componentts/Testimonials";
import CTA from "../componentts/CTA";
import Footer from "../componentts/Footer";
function LandingPage() {
    return (
        <>
            <Hero />
            <Stats />
            <Specialities />
            <TopDoctors />
            <Howitworks />
            <WhyChooseUs />
            <Testimonials />
            <CTA />
            <Footer/>

        </>
    );
}

export default LandingPage;