"use client"

import { useRef, useState, useEffect } from "react";
import { FiLock } from "react-icons/fi";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const TARGET_TEXT = "Encrypt your devices";
const CYCLES_PER_LETTER = 2;
const SHUFFLE_TIME = 50;
const CHARS = "!@#$%^&*():{};|,.<>/?";


const EncryptButton = () => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [text, setText] = useState(TARGET_TEXT);

  const scramble = () => {
    let pos = 0;
    intervalRef.current = setInterval(() => {
      const scrambled = TARGET_TEXT.split("")
        .map((char, index) => {
          if (pos / CYCLES_PER_LETTER > index) {
            return char;
          }
          const randomCharIndex = Math.floor(Math.random() * CHARS.length);
          return CHARS[randomCharIndex];
        })
        .join("");

      setText(scrambled);
      pos++;
      if (pos >= TARGET_TEXT.length * CYCLES_PER_LETTER) {
        stopScramble();
      }
    }, SHUFFLE_TIME);
  };

  const stopScramble = () => {
    clearInterval(intervalRef.current || undefined);
    setText(TARGET_TEXT);
  };

  const handleClick = () => {
    document.getElementById('authentication')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1, rotate: 2 }}
      whileTap={{ scale: 0.95 }}
      onMouseEnter={scramble}
      onMouseLeave={stopScramble}
      onClick={handleClick}
      className="group relative overflow-hidden rounded-lg border-[1px] border-neutral-500 bg-neutral-800 px-6 py-3 font-mono font-medium uppercase text-neutral-300 transition-all hover:text-indigo-300 shadow-lg backdrop-blur-md"
    >
      <div className="relative z-10 flex items-center gap-2">
        <FiLock />
        <span>{text}</span>
      </div>
      <motion.span
        initial={{ y: "100%" }}
        animate={{ y: "-100%" }}
        transition={{ repeat: Infinity, repeatType: "mirror", duration: 1, ease: "linear" }}
        className="absolute inset-0 z-0 scale-125 bg-gradient-to-t from-indigo-400/0 from-40% via-indigo-400/100 to-indigo-400/0 to-60% opacity-0 transition-opacity group-hover:opacity-100"
      />
    </motion.button>
  );
};

const BubbleText = ({ children }: { children: string }) => {
  useEffect(() => {
    const spans = document.querySelectorAll(
      ".hover-text span"
    ) as NodeListOf<HTMLSpanElement>;

    spans.forEach((span) => {
      span.addEventListener("mouseenter", function (this: typeof span) {
        this.style.fontWeight = "900";
        this.style.color = "rgb(238, 242, 255)";

        const leftNeighbor = this.previousElementSibling as HTMLSpanElement;
        const rightNeighbor = this.nextElementSibling as HTMLSpanElement;

        if (leftNeighbor) {
          leftNeighbor.style.fontWeight = "500";
          leftNeighbor.style.color = "rgb(199, 210, 254)";
        }
        if (rightNeighbor) {
          rightNeighbor.style.fontWeight = "500";
          rightNeighbor.style.color = "rgb(199, 210, 254)";
        }
      });

      span.addEventListener("mouseleave", function (this: typeof span) {
        this.style.fontWeight = "100";
        this.style.color = "rgb(165, 180, 252)";

        const leftNeighbor = this.previousElementSibling as HTMLSpanElement;
        const rightNeighbor = this.nextElementSibling as HTMLSpanElement;

        if (leftNeighbor) {
          leftNeighbor.style.fontWeight = "100";
          leftNeighbor.style.color = "rgb(165, 180, 252)";
        }

        if (rightNeighbor) {
          rightNeighbor.style.fontWeight = "100";
          rightNeighbor.style.color = "rgb(165, 180, 252)";
        }
      });
    });
  }, []);

  return (
    <span className="hover-text">
      {children.split("").map((char, idx) => (
        <span
          key={idx}
          style={{ transition: "0.35s font-weight, 0.35s color" }}
        >
          {char}
        </span>
      ))}
    </span>
  );
};

const Navbar = () => {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: 1, 
        duration: 1, 
        ease: "easeOut" 
      }}
      className="absolute top-6 left-0 right-0 z-20"
    >
      <ul
        onMouseLeave={() => {
          setPosition((pv) => ({
            ...pv,
            opacity: 0,
          }));
        }}
        className="relative mx-auto flex w-fit rounded-full border-2 border-white bg-neutral-800/50 p-1 backdrop-blur-md"
      >
        <Tab setPosition={setPosition}>Home</Tab>
        <Tab setPosition={setPosition}>Features</Tab>
        <Tab setPosition={setPosition}>Authentication</Tab>
        <Cursor position={position} />
      </ul>
    </motion.nav>
  );
};

const Tab = ({ children, setPosition }: { children: string; setPosition: (pos: any) => void }) => {
  const ref = useRef<HTMLLIElement>(null);

  const handleClick = () => {
    const id = children.toLowerCase();
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <li
      ref={ref}
      onClick={handleClick}
      onMouseEnter={() => {
        if (!ref?.current) return;
        const { width } = ref.current.getBoundingClientRect();
        setPosition({
          left: ref.current.offsetLeft,
          width,
          opacity: 1,
        });
      }}
      className="relative z-10 block cursor-pointer px-3 py-1.5 text-xs uppercase text-neutral-300 hover:text-white md:px-5 md:py-3 md:text-base transition-colors duration-200"
    >
      {children}
    </li>
  );
};

const Cursor = ({ position }: { position: { left: number; width: number; opacity: number } }) => {
  return (
    <motion.li
      animate={{
        ...position,
      }}
      className="absolute z-0 h-7 rounded-full bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 md:h-12"
    />
  );
};

export default function Hero() {
  return (
    <header className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black text-white">
      <Navbar />
      <Particles
        className="absolute inset-0 z-0"
        options={{
          particles: {
            number: { value: 100 },
            size: { value: 2 },
            move: { speed: 0.6 },
          },
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 text-center"
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 animate-text-glow"
        >
          Secure Your Smart Home
        </motion.h1>
        <p className="text-lg md:text-2xl mt-4 text-gray-300">
          <BubbleText>Blockchain-powered IoT authentication for ultimate peace of mind</BubbleText>
        </p>
        <div className="mt-10 flex justify-center">
          <EncryptButton />
        </div>
      </motion.div>
    </header>
  );
}
