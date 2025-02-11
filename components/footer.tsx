"use client"

import { motion } from "framer-motion";

const DURATION = 0.25;
const STAGGER = 0.025;

const FlipLink = ({ children, href }: { children: string; href: string }) => {
  return (
    <motion.a
      initial="initial"
      whileHover="hovered"
      href={href}
      className="relative block overflow-hidden whitespace-nowrap text-lg font-semibold"
    >
      <div>
        {children.split("").map((l, i) => (
          <motion.span
            variants={{
              initial: { y: 0 },
              hovered: { y: "-100%" },
            }}
            transition={{
              duration: DURATION,
              ease: "easeInOut",
              delay: STAGGER * i,
            }}
            className="inline-block text-neutral-400"
            key={i}
          >
            {l}
          </motion.span>
        ))}
      </div>
      <div className="absolute inset-0">
        {children.split("").map((l, i) => (
          <motion.span
            variants={{
              initial: { y: "100%" },
              hovered: { y: 0 },
            }}
            transition={{
              duration: DURATION,
              ease: "easeInOut",
              delay: STAGGER * i,
            }}
            className="inline-block text-indigo-400"
            key={i}
          >
            {l}
          </motion.span>
        ))}
      </div>
    </motion.a>
  );
};

export default function Footer() {
  return (
    <footer className="bg-black text-neutral-400 py-12 border-t border-neutral-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-start">
          <div className="w-full md:w-1/3 mb-8 md:mb-0">
            <h3 className="text-lg font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500">
              Smart Home IoT Auth
            </h3>
            <p className="text-sm text-neutral-300">Securing your smart home, one device at a time.</p>
          </div>
          <div className="w-full md:w-1/3 mb-8 md:mb-0">
            <h4 className="text-md font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500">
              Quick Links
            </h4>
            <div className="flex flex-col space-y-4">
              <FlipLink 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                Home
              </FlipLink>
              <FlipLink 
                href="#features"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Features
              </FlipLink>
              <FlipLink 
                href="#authentication"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('authentication')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Authentication
              </FlipLink>
            </div>
          </div>
          <div className="w-full md:w-1/3">
            <h4 className="text-md font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500">
              Connect With Us
            </h4>
            <div className="flex flex-col space-y-4">
              <FlipLink href="https://x.com/iqbal_taseen">Twitter</FlipLink>
              <FlipLink href="https://github.com/PaleDeath">GitHub</FlipLink>
              <FlipLink href="https://www.linkedin.com/in/taseen-iqbal-2b428125b/">LinkedIn</FlipLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

