import Navbar from "./_components/Navbar";
import Hero from "./_components/Hero";
import Features from "./_components/Features";
import HowItWorks from "./_components/HowItWorks";
import DemoPreview from "./_components/DemoPreview";
import Testimonials from "./_components/Testimonials";
import Pricing from "./_components/Pricing";
import Footer from "./_components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white scroll-smooth">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <DemoPreview />
      <Testimonials />
      <Pricing />
      <Footer />
    </main>
  );
}
