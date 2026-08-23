"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const SECTIONS = [
  {
    title: "How Josh Started with Art",
    body: "Stone@rt is a Durban based professional fine artist specializing in corporate branding artworks in spaces and places, incorporating a wide and abundant amount of honed-in skills across particular mediums — signwriting, signage and fabrication, lighting, clothing and textiles, fine art and galleries, graffiti, street art installations, photography, videography, animation, graphic design, canvases and murals.",
  },
  {
    title: "Training",
    body: "Self taught, with inspiration from great friends along the journey and path, and all the people I have met and been inspired by. I give many thanks and gratitude to those who have given their time and dedication to sketching our great art as a global, universal collaboration — no tiny idea is a waste, everything is a masterpiece and design of the greatness that is in us all. Acknowledgement is needed for all who consciously contribute with great, amazing, beautiful intentions and collaborations. Every day is a new path to learn something new about our amazing universe and how art is in us all.",
  },
  {
    title: "Artists Who Inspire Him",
    body: "Salvador Dalí, and community projects and inspirational artists within the community.",
  },
  {
    title: "Local Artists",
    body: "I always take my hat off to those artists who continue creating in South Africa even though the funding and appraisal is insignificant in this country. Your art means the world to someone out there — it touches their heart and soul. Never stop making and producing your creations from your heart, feel the art, and let it consume your ability to communicate those emotions to all beings that come across your path in life, leaving a footprint of love and divine inspiration to all you conceive.",
  },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 rounded-full bg-primary p-4 text-center text-3xl font-bold text-primary-foreground"
      >
        About My Journey
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="mb-8 overflow-hidden pt-0">
          <div className="relative h-64 w-full">
            <Image
              src="https://images.pexels.com/photos/1656059/pexels-photo-1656059.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Josh at work"
              fill
              className="object-cover"
              priority
            />
          </div>
          <CardContent>
            <h2 className="mb-2 text-xl font-semibold">{SECTIONS[0].title}</h2>
            <p className="text-muted-foreground">{SECTIONS[0].body}</p>
          </CardContent>
        </Card>
      </motion.div>

      {SECTIONS.slice(1).map((section, i) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
        >
          <Card className="mb-8">
            <CardContent>
              <h2 className="mb-2 text-xl font-semibold">{section.title}</h2>
              <p className="text-muted-foreground">{section.body}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
