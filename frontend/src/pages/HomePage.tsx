import HeroSection from "../components/home/HeroSection";
import HowItWorkSection from "../components/home/HowItWorkSection";
import FAQSection from "../components/home/FAQSection";
import FeatureSection from "../components/home/FeatureSection";
import RatingSection from "../components/home/RatingSection";
import StatsSection from "../components/home/StatsSection";

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeatureSection />
      <HowItWorkSection />
      <RatingSection />
      <FAQSection />
    </>
  )
}
export default HomePage
