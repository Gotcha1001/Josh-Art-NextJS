// "use client";

// import Image from "next/image";
// import { motion } from "framer-motion";
// import { Mail, Phone } from "lucide-react";
// import { ContactForm } from "@/components/shared/contact-form";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { FacebookIcon, InstagramIcon, TikTokIcon } from "@/components/icons";

// const CONTACT_EMAIL = "heartworksfoundation@outlook.com";
// const CONTACT_PHONE_DISPLAY = "064 8468693";
// const CONTACT_PHONE_HREF = "+27648468693";

// const SOCIALS = [
//   {
//     href: "https://www.facebook.com/Stoneartcity",
//     Icon: FacebookIcon,
//     className: "text-blue-500",
//   },
//   {
//     href: "https://www.instagram.com/cornerstone_in_th3_spirit/?igsh=anRsOGozcXc3dHp2&utm_source=qr",
//     Icon: InstagramIcon,
//     className: "text-purple-500",
//   },
//   {
//     href: "https://www.tiktok.com/@stoneartcity?_t=8no3pt4ShRF&_r=1",
//     Icon: TikTokIcon,
//     className: "text-teal-700",
//   },
// ];

// export default function ContactPage() {
//   return (
//     <div className="container mx-auto max-w-3xl px-4 py-10">
//       <div className="mb-8 flex flex-col items-center gap-4">
//         <div className="flex items-center gap-5">
//           {SOCIALS.map(({ href, Icon, className }) => (
//             <motion.a
//               key={href}
//               href={href}
//               target="_blank"
//               rel="noopener noreferrer"
//               whileHover={{ rotate: [0, -10, 10, -6, 6, 0] }}
//               transition={{ duration: 0.5 }}
//               className={className}
//             >
//               <Icon className="h-8 w-8" />
//             </motion.a>
//           ))}
//         </div>
//         <motion.h1
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.4 }}
//           className="text-3xl font-semibold"
//         >
//           Contact Us
//         </motion.h1>
//       </div>

//       <div className="mb-8 flex flex-col items-center gap-6">
//         <motion.div whileHover={{ scale: 1.08 }} transition={{ duration: 0.3 }}>
//           <Image
//             src="https://images.pexels.com/photos/4659806/pexels-photo-4659806.jpeg?auto=compress&cs=tinysrgb&w=600"
//             alt="Contact Us"
//             width={240}
//             height={240}
//             className="rounded-full object-cover shadow-md"
//           />
//         </motion.div>

//         <div className="w-full max-w-2xl">
//           <ContactForm />
//         </div>
//       </div>

//       <div className="mb-8 flex justify-center gap-6">
//         <motion.a
//           href={`mailto:${CONTACT_EMAIL}`}
//           whileHover={{ rotate: [0, -8, 8, -6, 6, 0] }}
//           transition={{ duration: 0.5 }}
//           className="text-red-800 hover:text-primary"
//         >
//           <Mail className="h-10 w-10" />
//         </motion.a>
//         <motion.a
//           href={`tel:${CONTACT_PHONE_HREF}`}
//           whileHover={{ rotate: [0, -8, 8, -6, 6, 0] }}
//           transition={{ duration: 0.5 }}
//           className="text-blue-900 hover:text-primary"
//         >
//           <Phone className="h-10 w-10" />
//         </motion.a>
//       </div>

//       <div className="mb-8 flex justify-center">
//         <Card className="w-full max-w-xs">
//           <CardHeader>
//             <CardTitle className="text-teal-600">Contact Information</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-2 text-sm">
//             <a
//               href={`mailto:${CONTACT_EMAIL}`}
//               className="flex items-center gap-2 hover:text-teal-500"
//             >
//               <Mail className="h-4 w-4" /> Email: {CONTACT_EMAIL}
//             </a>
//             <a
//               href={`tel:${CONTACT_PHONE_HREF}`}
//               className="flex items-center gap-2 hover:text-teal-500"
//             >
//               <Phone className="h-4 w-4" /> Phone: {CONTACT_PHONE_DISPLAY}
//             </a>
//           </CardContent>
//         </Card>
//       </div>

//       <div className="flex justify-center">
//         <motion.div
//           whileHover={{ scale: 1.03 }}
//           transition={{ duration: 0.3 }}
//           className="w-full max-w-xs"
//         >
//           <Card className="border-none bg-slate-950 text-white transition-colors hover:bg-teal-700">
//             <CardHeader>
//               <CardTitle className="text-center text-teal-400">
//                 Banking Details
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-1 text-sm">
//               <p>Bank Name: TymeBank</p>
//               <p>Account Type: EveryDay Account</p>
//               <p>Account Number: 51100254841</p>
//               <p>Branch Code: 678910</p>
//               <p>Account Holder Name: TymeBank JDH</p>
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, MessageCircle, Copy, Check, Landmark } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "@/components/icons";

const CONTACT_EMAIL = "heartworksfoundation@outlook.com";
const CONTACT_PHONE_DISPLAY = "064 8468693";
// wa.me needs digits only, country code first, no leading 0 on the local number
const CONTACT_WHATSAPP_HREF = "https://wa.me/27648468693";

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

const BANK_DETAILS = [
  { label: "Bank Name", value: "TymeBank" },
  { label: "Account Type", value: "EveryDay Account" },
  { label: "Account Number", value: "51100254841" },
  { label: "Branch Code", value: "678910" },
  { label: "Account Holder", value: "TymeBank JDH" },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 260, damping: 22 },
  },
};

function CopyableRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="group flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left transition-colors hover:bg-white/5"
    >
      <span>
        <span className="text-white/50">{label}:</span> {value}
      </span>
      <motion.span
        initial={false}
        animate={{ scale: copied ? [1, 1.3, 1] : 1 }}
        transition={{ duration: 0.3 }}
        className="ml-2 shrink-0 text-white/40 group-hover:text-teal-300"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </motion.span>
    </button>
  );
}

export default function ContactPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-24 top-0 h-96 w-96 rounded-full bg-teal-400/20 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-24 top-40 h-96 w-96 rounded-full bg-purple-400/20 blur-3xl"
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="container mx-auto max-w-3xl px-4 py-16"
      >
        <motion.div
          variants={itemVariants}
          className="mb-10 flex flex-col items-center gap-5"
        >
          <div className="flex items-center gap-5">
            {SOCIALS.map(({ href, Icon, className }) => (
              <motion.a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ rotate: [0, -10, 10, -6, 6, 0], scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className={className}
              >
                <Icon className="h-8 w-8" />
              </motion.a>
            ))}
          </div>

          <h1 className="bg-gradient-to-r from-teal-400 via-cyan-400 to-purple-400 bg-clip-text text-center text-4xl font-bold tracking-tight text-transparent md:text-5xl">
            Get In Touch
          </h1>
          <p className="max-w-md text-center text-white/60">
            Reach out directly by email or WhatsApp — I usually reply within a
            day.
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mb-10 flex justify-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="relative"
          >
            <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-teal-400 to-purple-400 opacity-0 blur-lg" />
            <Image
              src="https://images.pexels.com/photos/4659806/pexels-photo-4659806.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Contact Us"
              width={220}
              height={220}
              className="rounded-full border-4 border-white/10 object-cover shadow-xl"
            />
          </motion.div>
        </motion.div>

        {/* Primary contact actions */}
        <motion.div
          variants={itemVariants}
          className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          <motion.a
            href={`mailto:${CONTACT_EMAIL}`}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-colors hover:border-red-400/40 hover:bg-red-400/10"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-500/15 text-red-400">
              <Mail className="h-6 w-6" />
            </span>
            <span>
              <span className="block text-sm text-white/50">Email</span>
              <span className="block font-medium">{CONTACT_EMAIL}</span>
            </span>
          </motion.a>

          <motion.a
            href={CONTACT_WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-colors hover:border-green-400/40 hover:bg-green-400/10"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-500/15 text-green-400">
              <MessageCircle className="h-6 w-6" />
            </span>
            <span>
              <span className="block text-sm text-white/50">WhatsApp</span>
              <span className="block font-medium">{CONTACT_PHONE_DISPLAY}</span>
            </span>
          </motion.a>
        </motion.div>

        {/* Banking details */}
        <motion.div variants={itemVariants} className="flex justify-center">
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-full max-w-sm"
          >
            <Card className="overflow-hidden border-white/10 bg-slate-950/80 text-white backdrop-blur-sm">
              <CardHeader className="items-center pb-2">
                <span className="mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-teal-400/15 text-teal-300">
                  <Landmark className="h-5 w-5" />
                </span>
                <CardTitle className="text-center text-teal-300">
                  Banking Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-0.5 text-sm">
                {BANK_DETAILS.map((item) => (
                  <CopyableRow
                    key={item.label}
                    label={item.label}
                    value={item.value}
                  />
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
