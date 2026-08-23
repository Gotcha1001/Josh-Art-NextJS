"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Phone, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const MURAL_SIZES = [
  {
    size: "Small",
    dimensions: "3m x 4m",
    price: "R4500",
    image:
      "https://cdn.pixabay.com/photo/2017/08/31/17/51/graffiti-2701641_1280.jpg",
  },
  {
    size: "Medium",
    dimensions: "5m x 7m",
    price: "R8500",
    image:
      "https://images.pexels.com/photos/2045248/pexels-photo-2045248.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    size: "Large",
    dimensions: "8m x 10m",
    price: "R15000",
    image:
      "https://images.pexels.com/photos/1766236/pexels-photo-1766236.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    size: "X-Large",
    dimensions: "10m x 12m",
    price: "R22000",
    image:
      "https://images.pexels.com/photos/5909881/pexels-photo-5909881.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    size: "XX-Large",
    dimensions: "12m x 15m",
    price: "R30000",
    image:
      "https://cdn.pixabay.com/photo/2017/10/14/23/16/wall-art-2852191_1280.jpg",
  },
  {
    size: "Gigantic",
    dimensions: "15m x 20m",
    price: "R40000",
    image:
      "https://cdn.pixabay.com/photo/2024/02/21/20/38/street-art-8588572_1280.jpg",
  },
];

const CONTACT_EMAIL = "heartworksfoundation@outlook.com";
const CONTACT_PHONE_DISPLAY = "064 8468693";
const CONTACT_PHONE_HREF = "+27648468693";

export default function ArtPricingPage() {
  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center px-4 py-10">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 rounded-full bg-primary p-3 text-center text-3xl font-bold text-primary-foreground md:text-4xl"
      >
        Spray Paint Mural Pricing
      </motion.h1>

      <div className="grid w-full grid-cols-1 gap-4 md:w-3/4 md:grid-cols-2 lg:grid-cols-3">
        {MURAL_SIZES.map((mural, i) => (
          <motion.div
            key={mural.size}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Card className="overflow-hidden pt-0">
              <div className="relative h-64 w-full">
                <Image
                  src={mural.image}
                  alt={mural.size}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="text-center">
                <h2 className="mb-2 text-xl font-semibold">{mural.size}</h2>
                <p className="mb-2 text-muted-foreground">{mural.dimensions}</p>
                <p className="text-2xl font-bold">{mural.price}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <motion.h2
          whileHover={{ scale: 1.03 }}
          className="mb-4 rounded-full bg-indigo-950 p-3 text-xl font-bold text-white transition-colors md:text-2xl"
        >
          This is an estimate.
        </motion.h2>
        <motion.p
          whileHover={{ scale: 1.03 }}
          className="mb-4 rounded-full bg-teal-400 p-3 text-lg font-bold text-black"
        >
          Contact us and we&apos;ll make a quote based on your needs and
          requirements.
        </motion.p>

        <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
          <a
            href={`tel:${CONTACT_PHONE_HREF}`}
            className="flex items-center gap-2 text-lg hover:text-teal-500"
          >
            <Phone className="h-5 w-5" />
            {CONTACT_PHONE_DISPLAY}
          </a>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="flex items-center gap-2 text-lg hover:text-teal-500"
          >
            <Mail className="h-5 w-5" />
            {CONTACT_EMAIL}
          </a>
        </div>
      </div>
    </div>
  );
}
