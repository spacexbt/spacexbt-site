import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { FarmingList } from "@/components/farming-list";
import { Hero } from "@/components/hero";
import { ProjectsSection } from "@/components/projects-section";
import { site } from "@/content/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "spacexbt",
  url: site.url,
  sameAs: [site.links.x, site.links.telegramDm, site.links.telegram],
};

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <ProjectsSection />
      <FarmingList />
      <About />
      <Contact />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
