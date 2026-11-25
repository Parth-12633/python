import { useCallback, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { APP_URL, OG_IMAGE_URL } from '../config';
import { projectsData } from '../data/projectsData';
import { scrollToTarget } from '../lib/lenis';
import { Contact } from '../components/sections/Contact';
import { CtaBand } from '../components/sections/CtaBand';
import { Hero } from '../components/sections/Hero';
import { Manifesto } from '../components/sections/Manifesto';
import { Divider } from '../components/ui/Divider';
import { Metrics } from '../components/sections/Metrics';
import { Process } from '../components/sections/Process';
import { Projects } from '../components/sections/Projects';
import { Services } from '../components/sections/Services';
import { TechStack } from '../components/sections/TechStack';
import { Ticker } from '../components/sections/Ticker';
import { WhyUs } from '../components/sections/WhyUs';

const TITLE = 'NovaCraft Studio — Premium Software Development & AI Agency';

export default function Home() {
  const [projectFilter, setProjectFilter] = useState<string | null>(null);

  const filteredProjects = useMemo(
    () =>
      projectFilter
        ? projectsData.filter((p) => {
            const q = projectFilter.toLowerCase();
            return p.tags.some((tag) => tag.toLowerCase().includes(q)) || p.category.toLowerCase().includes(q);
          })
        : projectsData,
    [projectFilter]
  );

  const handleTechFilter = useCallback((tech: string) => {
    setProjectFilter(tech);
    const anchor = document.getElementById('more-projects') || document.getElementById('projects');
    if (anchor) scrollToTarget(anchor, { offset: -110 });
  }, []);

  return (
    <main>
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content="We build premium software, AI systems, and digital products that scale. Based in India, working globally." />
        <meta name="keywords" content="software development agency, AI agency, React development, web development India, Next.js agency" />
        <link rel="canonical" href={APP_URL} />

        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content="We build premium software, AI systems, and digital products that scale." />
        <meta property="og:image" content={OG_IMAGE_URL} />
        <meta property="og:url" content={APP_URL} />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content="We build premium software, AI systems, and digital products that scale." />
        <meta name="twitter:image" content={OG_IMAGE_URL} />

        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            "name": "NovaCraft Studio",
            "description": "Premium software development and AI agency",
            "url": "${APP_URL}",
            "logo": "${APP_URL}/logo.png",
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "availableLanguage": ["English", "Hindi"]
            },
            "address": { "@type": "PostalAddress", "addressCountry": "IN" },
            "sameAs": [
              "https://github.com/YOUR_GITHUB",
              "https://linkedin.com/company/YOUR_LINKEDIN"
            ]
          }
        `}</script>
      </Helmet>

      <Hero />
      <Ticker />
      <Manifesto />
      <Divider />
      <Metrics />
      <Services />
      <Divider />
      <Process />
      <Projects projects={filteredProjects} projectFilter={projectFilter} setProjectFilter={setProjectFilter} />
      <Divider />
      <TechStack onSelect={handleTechFilter} />
      <WhyUs />
      <CtaBand />
      <Contact />
    </main>
  );
}
