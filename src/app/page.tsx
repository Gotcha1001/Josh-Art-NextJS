// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { motion, AnimatePresence } from "framer-motion";
// import { doc, getDoc, setDoc } from "firebase/firestore";
// import { db } from "@/lib/firebase";
// import { useAuth } from "@/hooks/use-auth";
// import {
//   CloudinaryUploader,
//   CloudinaryUploadResult,
// } from "@/components/shared/cloudinary-uploader";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";

// // const CAROUSEL_IMAGES = [
// //   "https://scontent-jnb2-1.xx.fbcdn.net/v/t39.30808-6/296994898_606217204394792_1204140282823884444_n.jpg",
// //   "https://scontent-jnb2-1.xx.fbcdn.net/v/t39.30808-6/292277856_590530932643016_5574078880372931679_n.jpg",
// //   "https://scontent-jnb2-1.xx.fbcdn.net/v/t1.6435-9/30738312_1216796741788460_4130296716568035328_n.jpg",
// //   "https://scontent-jnb2-1.xx.fbcdn.net/v/t1.6435-9/97969910_1880355728765888_2083936724932624384_n.jpg",
// //   "https://scontent-jnb2-1.xx.fbcdn.net/v/t1.6435-9/98463373_1880355098765951_9219392113999872000_n.jpg",
// //   "https://scontent-jnb2-1.xx.fbcdn.net/v/t1.6435-9/83133337_1770145579786904_4465451160911740928_n.jpg",
// //   "https://scontent-jnb2-1.xx.fbcdn.net/v/t1.6435-9/74624030_1674658559335607_2799610763302404096_n.jpg",
// // ];

// const CAROUSEL_IMAGES = [
//   "/Art1.jpg",
//   "/Art2.jpg",
//   "/Art3.jpg",
//   "/Art4.jpg",
//   "/Art5.jpg",
//   "/Art6.jpg",
//   "/Art7.jpg",
//   "/Art8.jpg",
//   "/Art9.jpg",
//   "/Art10.jpg",
// ];

// const GRID_IMAGES = [
//   "/Art10.jpg",
//   "https://images.pexels.com/photos/1209843/pexels-photo-1209843.jpeg?auto=compress&cs=tinysrgb&w=600",
//   "https://images.pexels.com/photos/1646953/pexels-photo-1646953.jpeg?auto=compress&cs=tinysrgb&w=600",
//   "https://images.pexels.com/photos/1109354/pexels-photo-1109354.jpeg?auto=compress&cs=tinysrgb&w=600",
//   "https://images.pexels.com/photos/1704120/pexels-photo-1704120.jpeg?auto=compress&cs=tinysrgb&w=600",
//   "https://images.pexels.com/photos/1133957/pexels-photo-1133957.jpeg?auto=compress&cs=tinysrgb&w=600",
// ];

// function HeroCarousel() {
//   const [index, setIndex] = useState(0);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setIndex((i) => (i + 1) % CAROUSEL_IMAGES.length);
//     }, 4000);
//     return () => clearInterval(timer);
//   }, []);

//   return (
//     <div className="relative mx-auto mb-8 aspect-video w-full max-w-2xl overflow-hidden rounded-lg shadow-lg">
//       <AnimatePresence mode="wait">
//         <motion.div
//           key={index}
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           transition={{ duration: 0.6 }}
//           className="absolute inset-0"
//         >
//           <Image
//             src={CAROUSEL_IMAGES[index]}
//             alt={`Slide ${index + 1}`}
//             fill
//             className="object-cover"
//             unoptimized
//           />
//         </motion.div>
//       </AnimatePresence>
//       <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
//         {CAROUSEL_IMAGES.map((_, i) => (
//           <button
//             key={i}
//             onClick={() => setIndex(i)}
//             aria-label={`Go to slide ${i + 1}`}
//             className={`h-2 w-2 rounded-full transition-colors ${
//               i === index ? "bg-white" : "bg-white/40"
//             }`}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// export default function HomePage() {
//   const { isAdmin } = useAuth();

//   const [backgroundImageUrl, setBackgroundImageUrl] = useState("");
//   const [mainImageUrl, setMainImageUrl] = useState("");
//   const [loadingSettings, setLoadingSettings] = useState(true);

//   const [backgroundDialogOpen, setBackgroundDialogOpen] = useState(false);
//   const [mainImageDialogOpen, setMainImageDialogOpen] = useState(false);

//   useEffect(() => {
//     (async () => {
//       try {
//         const snap = await getDoc(doc(db, "settings", "background"));
//         if (snap.exists()) {
//           const data = snap.data();
//           setBackgroundImageUrl(data.backgroundImageUrl ?? "");
//           setMainImageUrl(data.mainImageUrl ?? "");
//         }
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoadingSettings(false);
//       }
//     })();
//   }, []);

//   const saveBackground = async (result: CloudinaryUploadResult) => {
//     setBackgroundImageUrl(result.url);
//     setBackgroundDialogOpen(false);
//     await setDoc(
//       doc(db, "settings", "background"),
//       { backgroundImageUrl: result.url, mainImageUrl },
//       { merge: true },
//     );
//   };

//   const saveMainImage = async (result: CloudinaryUploadResult) => {
//     setMainImageUrl(result.url);
//     setMainImageDialogOpen(false);
//     await setDoc(
//       doc(db, "settings", "background"),
//       { backgroundImageUrl, mainImageUrl: result.url },
//       { merge: true },
//     );
//   };

//   return (
//     <div className="relative">
//       {/* Background layer — separated from content so brightness only dims the backdrop, not text/images on top */}
//       {backgroundImageUrl && (
//         <div
//           className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat brightness-90"
//           style={{ backgroundImage: `url(${backgroundImageUrl})` }}
//         >
//           <div className="absolute inset-0 bg-background/40" />
//         </div>
//       )}

//       <div className="container mx-auto flex flex-col items-center px-4 py-10">
//         {isAdmin && !loadingSettings && (
//           <div className="mb-6 flex flex-wrap justify-center gap-3">
//             <Button
//               className="rounded-full"
//               onClick={() => setBackgroundDialogOpen(true)}
//             >
//               Change Background
//             </Button>
//             <Button
//               className="rounded-full"
//               onClick={() => setMainImageDialogOpen(true)}
//             >
//               Change Main Image
//             </Button>
//           </div>
//         )}

//         <motion.h1
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="mb-8 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 p-3 text-center text-3xl font-bold text-white md:text-4xl"
//         >
//           CORNERSTONE IN TH3 SPIRIT
//         </motion.h1>

//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.5, delay: 0.1 }}
//           whileHover={{ scale: 1.02 }}
//           className="relative mb-8 aspect-video w-full max-w-xl overflow-hidden rounded-lg shadow-lg"
//         >
//           <Image
//             src="https://raw.githubusercontent.com/Gotcha1001/My-Images-for-sites-Wes/main/JoshLogo.JPG"
//             alt="Josh's Art Logo"
//             fill
//             className="object-contain"
//             priority
//           />
//         </motion.div>

//         {mainImageUrl && (
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.5, delay: 0.15 }}
//             whileHover={{ scale: 1.02 }}
//             className="relative mb-8 aspect-video w-full max-w-xl overflow-hidden rounded-lg shadow-lg"
//           >
//             <Image
//               src={mainImageUrl}
//               alt="Featured artwork"
//               fill
//               className="object-contain"
//               unoptimized
//             />
//           </motion.div>
//         )}

//         <HeroCarousel />

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.5 }}
//           className="mt-8 w-full max-w-xl"
//         >
//           <Card className="overflow-hidden">
//             <CardContent>
//               <h2 className="mb-4 text-center text-xl font-semibold">
//                 Josh&apos;s Latest Video
//               </h2>
//               <div className="relative aspect-video overflow-hidden rounded-lg">
//                 <iframe
//                   title="Josh's Video"
//                   src="https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2Fpaintingonpurposeco%2Fvideos%2F857612178952085%2F&show_text=false&width=560&t=0"
//                   className="absolute inset-0 h-full w-full border-0"
//                   allowFullScreen
//                   allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
//                 />
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>

//         <div className="mt-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//           {GRID_IMAGES.map((src, i) => (
//             <motion.div
//               key={src}
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.4, delay: i * 0.05 }}
//               whileHover={{ scale: 1.05 }}
//               className="relative h-64 w-full overflow-hidden rounded-lg shadow-lg"
//             >
//               <Image
//                 src={src}
//                 alt="Artwork"
//                 fill
//                 className="object-cover"
//                 unoptimized
//               />
//             </motion.div>
//           ))}
//         </div>
//       </div>

//       {/* Change Background dialog */}
//       <Dialog
//         open={backgroundDialogOpen}
//         onOpenChange={setBackgroundDialogOpen}
//       >
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Upload New Background Image</DialogTitle>
//           </DialogHeader>
//           <CloudinaryUploader
//             resourceType="image"
//             label="Background Image"
//             onUploadComplete={saveBackground}
//           />
//         </DialogContent>
//       </Dialog>

//       {/* Change Main Image dialog */}
//       <Dialog open={mainImageDialogOpen} onOpenChange={setMainImageDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Upload New Main Image</DialogTitle>
//           </DialogHeader>
//           <CloudinaryUploader
//             resourceType="image"
//             label="Main Image"
//             onUploadComplete={saveMainImage}
//           />
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import {
  CloudinaryUploader,
  CloudinaryUploadResult,
} from "@/components/shared/cloudinary-uploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sparkles } from "lucide-react";

const CAROUSEL_IMAGES = [
  "/Art1.jpg",
  "/Art2.jpg",
  "/Art3.jpg",
  "/Art4.jpg",
  "/Art5.jpg",
  "/Art6.jpg",
  "/Art7.jpg",
  "/Art8.jpg",
  "/Art9.jpg",
  "/Art10.jpg",
];

const GRID_IMAGES = [
  "/Art10.jpg",
  "https://images.pexels.com/photos/1209843/pexels-photo-1209843.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/1646953/pexels-photo-1646953.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/1109354/pexels-photo-1109354.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/1704120/pexels-photo-1704120.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/1133957/pexels-photo-1133957.jpeg?auto=compress&cs=tinysrgb&w=600",
];

// Ambient floating particles for the hero backdrop
function useFloatingParticles(count: number) {
  const [particles] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 5,
    })),
  );
  return particles;
}

function FloatingParticles() {
  const particles = useFloatingParticles(24);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-cyan-300/40"
          style={{
            top: `${p.top}%`,
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{ y: [0, -20, 0], opacity: [0.2, 0.8, 0.2] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mb-6 flex items-center justify-center gap-2"
    >
      <span className="h-px w-8 bg-gradient-to-r from-transparent to-cyan-400/60" />
      <h2 className="text-center text-xl font-semibold tracking-wide text-foreground/90">
        {children}
      </h2>
      <span className="h-px w-8 bg-gradient-to-l from-transparent to-cyan-400/60" />
    </motion.div>
  );
}

function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % CAROUSEL_IMAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative mx-auto mb-8 aspect-video w-full max-w-2xl overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={CAROUSEL_IMAGES[index]}
            alt={`Slide ${index + 1}`}
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {CAROUSEL_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="group relative h-2 w-2"
          >
            <motion.span
              className="absolute inset-0 rounded-full bg-white"
              animate={{
                scale: i === index ? 1.4 : 1,
                opacity: i === index ? 1 : 0.4,
              }}
              transition={{ duration: 0.3 }}
            />
          </button>
        ))}
      </div>
    </motion.div>
  );
}

const gridContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const gridItemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function HomePage() {
  const { isAdmin } = useAuth();

  const [backgroundImageUrl, setBackgroundImageUrl] = useState("");
  const [mainImageUrl, setMainImageUrl] = useState("");
  const [loadingSettings, setLoadingSettings] = useState(true);

  const [backgroundDialogOpen, setBackgroundDialogOpen] = useState(false);
  const [mainImageDialogOpen, setMainImageDialogOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, "settings", "background"));
        if (snap.exists()) {
          const data = snap.data();
          setBackgroundImageUrl(data.backgroundImageUrl ?? "");
          setMainImageUrl(data.mainImageUrl ?? "");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingSettings(false);
      }
    })();
  }, []);

  const saveBackground = async (result: CloudinaryUploadResult) => {
    setBackgroundImageUrl(result.url);
    setBackgroundDialogOpen(false);
    await setDoc(
      doc(db, "settings", "background"),
      { backgroundImageUrl: result.url, mainImageUrl },
      { merge: true },
    );
  };

  const saveMainImage = async (result: CloudinaryUploadResult) => {
    setMainImageUrl(result.url);
    setMainImageDialogOpen(false);
    await setDoc(
      doc(db, "settings", "background"),
      { backgroundImageUrl, mainImageUrl: result.url },
      { merge: true },
    );
  };

  return (
    <div className="relative">
      {/* Background layer */}
      {backgroundImageUrl && (
        <div
          className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat brightness-90"
          style={{ backgroundImage: `url(${backgroundImageUrl})` }}
        >
          <div className="absolute inset-0 bg-background/40" />
        </div>
      )}

      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden">
        <FloatingParticles />
        <div className="container relative z-10 mx-auto flex flex-col items-center px-4 pb-16 pt-14">
          {isAdmin && !loadingSettings && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 flex flex-wrap justify-center gap-3"
            >
              <Button
                variant="outline"
                className="rounded-full border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10"
                onClick={() => setBackgroundDialogOpen(true)}
              >
                Change Background
              </Button>
              <Button
                variant="outline"
                className="rounded-full border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10"
                onClick={() => setMainImageDialogOpen(true)}
              >
                Change Main Image
              </Button>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-3 flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/5 px-4 py-1 text-xs font-medium uppercase tracking-widest text-cyan-300"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Original Art &amp; Design
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative mb-2 bg-gradient-to-r from-teal-300 via-cyan-200 to-teal-400 bg-clip-text text-center text-4xl font-extrabold tracking-tight text-transparent md:text-6xl"
            style={{ backgroundSize: "200% auto" }}
          >
            <motion.span
              animate={{ backgroundPosition: ["0% center", "200% center"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              className="bg-gradient-to-r from-teal-300 via-cyan-200 to-teal-400 bg-clip-text text-transparent"
              style={{ backgroundSize: "200% auto" }}
            >
              CORNERSTONE IN TH3 SPIRIT
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mb-10 max-w-md text-center text-sm text-muted-foreground md:text-base"
          >
            Hand-painted originals, gallery pieces, and video walkthroughs from
            Josh&apos;s studio.
          </motion.p>

          {/* Logo — glow ring + gentle float */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative mb-10 w-full max-w-xl"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.03 }}
              className="group relative aspect-video overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10"
            >
              <div className="absolute -inset-1 -z-10 bg-gradient-to-r from-teal-500/30 via-cyan-400/20 to-teal-500/30 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
              <Image
                src="https://raw.githubusercontent.com/Gotcha1001/My-Images-for-sites-Wes/main/JoshLogo.JPG"
                alt="Josh's Art Logo"
                fill
                className="object-contain"
                priority
              />
            </motion.div>
          </motion.div>

          {mainImageUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              className="relative mb-4 aspect-video w-full max-w-xl overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10"
            >
              <Image
                src={mainImageUrl}
                alt="Featured artwork"
                fill
                className="object-contain"
                unoptimized
              />
            </motion.div>
          )}
        </div>
      </section>

      <div className="container mx-auto flex flex-col items-center px-4 pb-16">
        {/* ---------------- CAROUSEL ---------------- */}
        <SectionHeading>Featured Gallery</SectionHeading>
        <HeroCarousel />

        {/* ---------------- VIDEO ---------------- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-6 w-full max-w-xl"
        >
          <Card className="overflow-hidden border-white/10 bg-white/5 shadow-xl backdrop-blur-sm">
            <CardContent>
              <h2 className="mb-4 text-center text-xl font-semibold">
                Josh&apos;s Latest Video
              </h2>
              <div className="relative aspect-video overflow-hidden rounded-xl ring-1 ring-white/10">
                <iframe
                  title="Josh's Video"
                  src="https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2Fpaintingonpurposeco%2Fvideos%2F857612178952085%2F&show_text=false&width=560&t=0"
                  className="absolute inset-0 h-full w-full border-0"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ---------------- GRID ---------------- */}
        <div className="mt-12 w-full">
          <SectionHeading>More Artwork</SectionHeading>
          <motion.div
            variants={gridContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {GRID_IMAGES.map((src, i) => (
              <motion.div
                key={src + i}
                variants={gridItemVariants}
                whileHover={{ y: -6 }}
                className="group relative h-64 w-full overflow-hidden rounded-2xl shadow-lg ring-1 ring-white/10"
              >
                <Image
                  src={src}
                  alt="Artwork"
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute bottom-3 left-3 translate-y-2 text-sm font-medium text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  Original Piece
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Change Background dialog */}
      <Dialog
        open={backgroundDialogOpen}
        onOpenChange={setBackgroundDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload New Background Image</DialogTitle>
          </DialogHeader>
          <CloudinaryUploader
            resourceType="image"
            label="Background Image"
            onUploadComplete={saveBackground}
          />
        </DialogContent>
      </Dialog>

      {/* Change Main Image dialog */}
      <Dialog open={mainImageDialogOpen} onOpenChange={setMainImageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload New Main Image</DialogTitle>
          </DialogHeader>
          <CloudinaryUploader
            resourceType="image"
            label="Main Image"
            onUploadComplete={saveMainImage}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
