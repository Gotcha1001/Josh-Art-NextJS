"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const FOOTER_LINKS = [
  { href: "/references", label: "References" },
  { href: "/business-details", label: "Business Details" },
  { href: "/data-protection", label: "Data Protection" },
];

// Fixed set of stars generated once per mount so positions don't jump on re-render.
function useStarField(count: number) {
  const [stars] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 1.6 + 0.6,
      duration: Math.random() * 3 + 2.5,
      delay: Math.random() * 4,
    })),
  );
  return stars;
}

function StarField() {
  const stars = useStarField(30);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {stars.map((star) => (
        <motion.span
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: star.size,
            height: star.size,
          }}
          animate={{ opacity: [0.15, 1, 0.15], x: [0, 6, 0] }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-gradient-to-r from-black via-neutral-900 to-black py-6 text-white shadow-lg">
      <StarField />
      <div className="container relative z-10 mx-auto flex flex-col items-center justify-between gap-4 px-4 sm:flex-row">
        <ul className="flex flex-wrap items-center justify-center gap-4">
          {FOOTER_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm text-white/60 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href="https://stoneartcity.blogspot.com/?m=1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/60 transition-colors hover:text-white"
            >
              Stone Art City Blog
            </a>
          </li>
        </ul>
        <motion.div
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6 }}
          className="relative h-24 w-40 overflow-hidden"
        >
          <Image
            src="https://raw.githubusercontent.com/Gotcha1001/My-Images-for-sites-Wes/main/JoshLogo.JPG"
            alt="Josh's Art Logo"
            fill
            className="object-contain"
          />
        </motion.div>
      </div>
    </footer>
  );
}
