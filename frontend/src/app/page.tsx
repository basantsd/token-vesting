import { Navbar, HeroSection, TrustBar, FeaturesSection, HowItWorksSection, TestimonialsSection, CTASection, Footer } from "@/components/landing/Landing";

export default function HomePage() {
  return (
    <main style={{ background: "var(--color-bg-base)", minHeight: "100vh" }}>
      <Navbar />
      <HeroSection />
      <TrustBar />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
