import type { Metadata } from "next"
import Dashboard from "@/components/dashboard"
import Hero from "@/components/hero"
import Features from "@/components/features"
import SystemOverview from "@/components/system-overview"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "Smart Home IoT Authentication",
  description: "Blockchain-Based IoT Authentication System for Smart Homes",
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      <Hero />
      <main className="container mx-auto">
        <section id="features">
          <Features />
        </section>
        <section id="authentication" className="py-24">
          <h2 className="text-4xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500">
            Your Smart Home Dashboard
          </h2>
          <Dashboard />
        </section>
        <section id="system-overview">
          <SystemOverview />
        </section>
      </main>
      <Footer />
    </div>
  )
}

