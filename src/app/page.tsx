import { Navbar } from "@/components/navbar"
import { Hero } from "@/sections/hero"
import { SocialProof } from "@/sections/social-proof"
import { HowItWorks } from "@/sections/how-it-works"
import { FeaturedCompanies } from "@/sections/featured-companies"
import { UpcomingVisits } from "@/sections/upcoming-visits"
import { Benefits } from "@/sections/benefits"
import { Testimonials } from "@/sections/testimonials"
import { Statistics } from "@/sections/statistics"
import { FAQ } from "@/sections/faq"
import { CTA } from "@/sections/cta"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <>
      {/* ── Ambient Background Layer ─────────────────────────── */}
      <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        {/* Noise texture */}
        <div className="noise-bg absolute inset-0" />

        {/* Animated grid */}
        <div className="animated-grid absolute inset-0" />

        {/* Floating light blobs */}
        <div
          className="animate-blob-1 absolute -top-32 -left-32 h-[600px] w-[600px] rounded-full opacity-[0.07]"
          style={{
            background:
              "radial-gradient(circle, rgba(59,130,246,0.6) 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
        <div
          className="animate-blob-2 absolute top-1/3 -right-48 h-[500px] w-[500px] rounded-full opacity-[0.05]"
          style={{
            background:
              "radial-gradient(circle, rgba(139,92,246,0.6) 0%, transparent 70%)",
            filter: "blur(120px)",
          }}
        />
        <div
          className="animate-blob-3 absolute -bottom-24 left-1/3 h-[550px] w-[550px] rounded-full opacity-[0.06]"
          style={{
            background:
              "radial-gradient(circle, rgba(59,130,246,0.4) 0%, rgba(139,92,246,0.3) 50%, transparent 70%)",
            filter: "blur(110px)",
          }}
        />
      </div>

      {/* ── Page Content ─────────────────────────────────────── */}
      <Navbar />
      <main>
        <Hero />
        <SocialProof />
        <HowItWorks />
        <FeaturedCompanies />
        <UpcomingVisits />
        <Benefits />
        <Testimonials />
        <Statistics />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
