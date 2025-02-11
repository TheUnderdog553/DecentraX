"use client"

import React, { ReactNode, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FiArrowUpRight } from "react-icons/fi"

const systemSections = [
  {
    imgUrl: "../images/architecture.png",
    subheading: "System Architecture",
    heading: "Three Pillars of Security",
    description: `Our system integrates three core components working in harmony:

    1. IoT Devices (ESP32 + Sensors)
    - Custom-designed ESP32 microcontrollers with integrated sensors
    - Secure boot and encrypted storage capabilities
    - Real-time authentication checks before any data transmission`
  },
  {
    imgUrl: "/images/security.png",
    subheading: "Security Implementation",
    heading: "Defense in Depth",
    description: `Security is built into every layer of our system:

    • Device Level
    - Secure boot sequence with hardware-based key storage
    - Encrypted communication channels using TLS 1.3
    - Regular firmware attestation checks`
  },
  {
    imgUrl: "/images/applications.png",
    subheading: "Real-World Applications",
    heading: "Beyond Theory",
    description: `Our system is designed for practical deployment in various scenarios:

    🏠 Smart Home Security
    - Secure access control for smart locks and security cameras
    - Authenticated environmental controls (HVAC, lighting)
    - Protected sensor networks for home automation`
  }
]

const IMG_PADDING = 24

const TextParallaxContent = ({
  imgUrl,
  subheading,
  heading,
  children,
}: {
  imgUrl: string
  subheading: string
  heading: string
  children: ReactNode
}) => {
  return (
    <div style={{ paddingLeft: IMG_PADDING, paddingRight: IMG_PADDING }}>
      <div className="relative h-[120vh]">
        <StickyImage imgUrl={imgUrl} />
        <OverlayCopy heading={heading} subheading={subheading} />
      </div>
      {children}
    </div>
  )
}

const StickyImage = ({ imgUrl }: { imgUrl: string }) => {
  const targetRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["end end", "end start"],
  })

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])

  return (
    <motion.div
      style={{
        backgroundImage: `url(${imgUrl})`,
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: `calc(70vh - ${IMG_PADDING * 2}px)`,
        top: IMG_PADDING,
        scale,
      }}
      ref={targetRef}
      className="sticky z-0 overflow-hidden rounded-3xl bg-neutral-900"
    >
      <motion.div
        className="absolute inset-0 bg-neutral-950/70"
        style={{ opacity }}
      />
    </motion.div>
  )
}

const OverlayCopy = ({
  subheading,
  heading,
}: {
  subheading: string
  heading: string
}) => {
  const targetRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [150, -150])
  const opacity = useTransform(scrollYProgress, [0.25, 0.5, 0.75], [0, 1, 0])

  return (
    <motion.div
      style={{ y, opacity }}
      ref={targetRef}
      className="absolute left-0 top-0 flex h-[70vh] w-full flex-col items-center justify-center text-white"
    >
      <p className="mb-2 text-center text-2xl md:mb-4 md:text-4xl">
        {subheading}
      </p>
      <p className="text-center text-5xl font-bold md:text-8xl">
        {heading}
      </p>
    </motion.div>
  )
}

const SectionContent = ({ description }: { description: string }) => (
  <div className="mx-auto max-w-7xl px-4 pb-24 pt-12">
    <Card className="bg-neutral-900/50 border-neutral-800">
      <CardContent className="p-8">
        <p className="text-neutral-400 leading-relaxed whitespace-pre-line font-mono text-lg">
          {description}
        </p>
      </CardContent>
    </Card>
  </div>
)

export default function SystemOverview() {
  return (
    <section className="bg-black">
      <div className="max-w-4xl mx-auto text-center mb-12 pt-24">
        <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500">
          System Architecture & Implementation
        </h2>
        <p className="text-neutral-400 mb-8">
          A comprehensive look at how our blockchain-based IoT authentication system 
          works from hardware to user interface, designed for real-world deployment.
        </p>
      </div>
      
      {systemSections.map((section, index) => (
        <TextParallaxContent
          key={index}
          imgUrl={section.imgUrl}
          subheading={section.subheading}
          heading={section.heading}
        >
          <SectionContent description={section.description} />
        </TextParallaxContent>
      ))}
    </section>
  )
} 