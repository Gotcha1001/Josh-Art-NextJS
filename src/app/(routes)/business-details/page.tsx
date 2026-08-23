"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const SERVICES = [
  "Murals",
  "Workshops",
  "Street art",
  "Graffiti",
  "Contracting and Painting",
  "Development",
  "Turn Key Projects",
  "Architecture",
  "Blue Prints",
  "Building rendering",
  "Conveyances",
  "Site and construction managers",
];

export default function BusinessDetailsPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="mb-2 inline-block rounded-lg bg-primary px-4 py-2 text-3xl font-bold text-primary-foreground">
          Josh Stone
        </h1>
        <p className="text-lg text-muted-foreground">
          Manager Creative Cube Media
          <br />
          HeartWorks Joshua Dylan Wade Harman
        </p>
        <p className="text-lg font-bold">
          Museum: Property Management Company : Photographer
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="mt-8 flex justify-center"
      >
        <motion.div whileHover={{ scale: 1.05 }} className="w-full max-w-md">
          <Card>
            <CardContent>
              <h2 className="mb-4 text-center text-xl font-semibold">
                Creative Property Branding
              </h2>
              <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                {SERVICES.map((service) => (
                  <li key={service}>{service}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="mt-8 text-center font-bold"
      >
        JHB/Durban
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        className="mb-4 mt-8 flex justify-center"
      >
        <div className="relative h-72 w-full max-w-2xl overflow-hidden rounded-lg shadow-md">
          <Image
            src="https://images.pexels.com/photos/936089/pexels-photo-936089.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="Business"
            fill
            className="object-cover"
          />
        </div>
      </motion.div>
    </div>
  );
}
