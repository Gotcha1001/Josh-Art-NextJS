"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, Phone } from "lucide-react";
import { ContactForm } from "@/components/shared/contact-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "@/components/icons";

const CONTACT_EMAIL = "heartworksfoundation@outlook.com";
const CONTACT_PHONE_DISPLAY = "064 8468693";
const CONTACT_PHONE_HREF = "+27648468693";

const SOCIALS = [
  {
    href: "https://www.facebook.com/Stoneartcity",
    Icon: FacebookIcon,
    className: "text-blue-500",
  },
  {
    href: "https://www.instagram.com/cornerstone_in_th3_spirit/?igsh=anRsOGozcXc3dHp2&utm_source=qr",
    Icon: InstagramIcon,
    className: "text-purple-500",
  },
  {
    href: "https://www.tiktok.com/@stoneartcity?_t=8no3pt4ShRF&_r=1",
    Icon: TikTokIcon,
    className: "text-teal-700",
  },
];

export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8 flex flex-col items-center gap-4">
        <div className="flex items-center gap-5">
          {SOCIALS.map(({ href, Icon, className }) => (
            <motion.a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ rotate: [0, -10, 10, -6, 6, 0] }}
              transition={{ duration: 0.5 }}
              className={className}
            >
              <Icon className="h-8 w-8" />
            </motion.a>
          ))}
        </div>
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-3xl font-semibold"
        >
          Contact Us
        </motion.h1>
      </div>

      <div className="mb-8 flex flex-col items-center gap-6">
        <motion.div whileHover={{ scale: 1.08 }} transition={{ duration: 0.3 }}>
          <Image
            src="https://images.pexels.com/photos/4659806/pexels-photo-4659806.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="Contact Us"
            width={240}
            height={240}
            className="rounded-full object-cover shadow-md"
          />
        </motion.div>

        <div className="w-full max-w-2xl">
          <ContactForm />
        </div>
      </div>

      <div className="mb-8 flex justify-center gap-6">
        <motion.a
          href={`mailto:${CONTACT_EMAIL}`}
          whileHover={{ rotate: [0, -8, 8, -6, 6, 0] }}
          transition={{ duration: 0.5 }}
          className="text-red-800 hover:text-primary"
        >
          <Mail className="h-10 w-10" />
        </motion.a>
        <motion.a
          href={`tel:${CONTACT_PHONE_HREF}`}
          whileHover={{ rotate: [0, -8, 8, -6, 6, 0] }}
          transition={{ duration: 0.5 }}
          className="text-blue-900 hover:text-primary"
        >
          <Phone className="h-10 w-10" />
        </motion.a>
      </div>

      <div className="mb-8 flex justify-center">
        <Card className="w-full max-w-xs">
          <CardHeader>
            <CardTitle className="text-teal-600">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="flex items-center gap-2 hover:text-teal-500"
            >
              <Mail className="h-4 w-4" /> Email: {CONTACT_EMAIL}
            </a>
            <a
              href={`tel:${CONTACT_PHONE_HREF}`}
              className="flex items-center gap-2 hover:text-teal-500"
            >
              <Phone className="h-4 w-4" /> Phone: {CONTACT_PHONE_DISPLAY}
            </a>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-xs"
        >
          <Card className="border-none bg-slate-950 text-white transition-colors hover:bg-teal-700">
            <CardHeader>
              <CardTitle className="text-center text-teal-400">
                Banking Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p>Bank Name: TymeBank</p>
              <p>Account Type: EveryDay Account</p>
              <p>Account Number: 51100254841</p>
              <p>Branch Code: 678910</p>
              <p>Account Holder Name: TymeBank JDH</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
