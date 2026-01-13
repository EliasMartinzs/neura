import FeaturesSection from "@/components/features-7";
import FooterSection from "./_components/footer";
import { HeroHeader } from "./_components/header";
import HeroSection from "./_components/hero-section";

export default function Home() {
  return (
    <>
      <HeroHeader />
      <HeroSection />
      <FeaturesSection />
      <FooterSection />
    </>
  );
}
