import HeroBanner from "@/components/home/HeroBanner";
import WhatWeDo from "@/components/home/WhatWeDo";
import MetricsSection from "@/components/home/MetricsSection";
import ProjectsPreview from "@/components/home/ProjectsPreview";
import NewsPreview from "@/components/home/NewsPreview";
import AlliesSection from "@/components/home/AlliesSection";
import SubscriptionBanner from "@/components/home/SubscriptionBanner";

const Index = () => {
  return (
    <main>
      <HeroBanner />
      <WhatWeDo />
      <MetricsSection />
      <ProjectsPreview />
      <NewsPreview />
      <AlliesSection />
      <SubscriptionBanner />
    </main>
  );
};

export default Index;
