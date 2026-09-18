import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Footer from "../components/Footer";
import FloatingAI from "../components/FloatingAI";

function Home() {
  return (
    <div className="min-h-screen">

      <Navbar />

      <Hero />

      <Features />

      <Footer />

      <FloatingAI />

    </div>
  );
}

export default Home;