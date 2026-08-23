"use client";

import { motion } from "framer-motion";
import { Mail, Phone, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const REFERENCES = [
  {
    name: "John Doe",
    title: "Art Critic",
    company: "Art Reviews Inc.",
    email: "john.doe@artreviews.com",
    phone: "(123) 456-7890",
    testimonial:
      "Josh's work is nothing short of revolutionary. His attention to detail and use of color are unmatched.",
  },
  {
    name: "Jane Smith",
    title: "Gallery Owner",
    company: "Smith Gallery",
    email: "jane.smith@smithgallery.com",
    phone: "(234) 567-8901",
    testimonial:
      "Hosting Josh's exhibition was a highlight for our gallery. His pieces drew in crowds and left a lasting impression.",
  },
  {
    name: "Emily Johnson",
    title: "Art Enthusiast",
    company: "Art Lovers Club",
    email: "emily.johnson@artlovers.com",
    phone: "(345) 678-9012",
    testimonial:
      "I've been following Josh's career for years. His evolution as an artist is inspiring, and his current work is breathtaking.",
  },
  {
    name: "Michael Brown",
    title: "Art Collector",
    company: "Private Collection",
    email: "michael.brown@collector.com",
    phone: "(456) 789-0123",
    testimonial:
      "Josh's pieces are the pride of my collection. Each artwork tells a unique story that captivates everyone who sees it.",
  },
];

export default function ReferencesPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-10">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center text-4xl font-bold"
      >
        References
      </motion.h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {REFERENCES.map((reference, i) => (
          <motion.div
            key={reference.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            whileHover={{ scale: 1.03 }}
          >
            <Card className="h-full">
              <CardContent>
                <h2 className="text-2xl font-semibold">{reference.name}</h2>
                <h3 className="mb-4 text-lg text-muted-foreground">
                  {reference.title} at {reference.company}
                </h3>

                <div className="mb-4 flex gap-2">
                  <Quote className="h-5 w-5 shrink-0 text-primary" />
                  <p className="italic text-muted-foreground">
                    &ldquo;{reference.testimonial}&rdquo;
                  </p>
                </div>

                <div className="space-y-1 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5" />
                    {reference.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5" />
                    {reference.phone}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
