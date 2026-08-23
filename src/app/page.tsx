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

const CAROUSEL_IMAGES = [
  "https://scontent-jnb2-1.xx.fbcdn.net/v/t39.30808-6/296994898_606217204394792_1204140282823884444_n.jpg",
  "https://scontent-jnb2-1.xx.fbcdn.net/v/t39.30808-6/292277856_590530932643016_5574078880372931679_n.jpg",
  "https://scontent-jnb2-1.xx.fbcdn.net/v/t1.6435-9/30738312_1216796741788460_4130296716568035328_n.jpg",
  "https://scontent-jnb2-1.xx.fbcdn.net/v/t1.6435-9/97969910_1880355728765888_2083936724932624384_n.jpg",
  "https://scontent-jnb2-1.xx.fbcdn.net/v/t1.6435-9/98463373_1880355098765951_9219392113999872000_n.jpg",
  "https://scontent-jnb2-1.xx.fbcdn.net/v/t1.6435-9/83133337_1770145579786904_4465451160911740928_n.jpg",
  "https://scontent-jnb2-1.xx.fbcdn.net/v/t1.6435-9/74624030_1674658559335607_2799610763302404096_n.jpg",
];

const GRID_IMAGES = [
  "https://scontent-jnb2-1.xx.fbcdn.net/v/t1.6435-9/42356084_1352853621516104_461180480004292608_n.jpg",
  "https://images.pexels.com/photos/1209843/pexels-photo-1209843.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/1646953/pexels-photo-1646953.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/1109354/pexels-photo-1109354.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/1704120/pexels-photo-1704120.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/1133957/pexels-photo-1133957.jpeg?auto=compress&cs=tinysrgb&w=600",
];

function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % CAROUSEL_IMAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative mx-auto mb-8 aspect-video w-full max-w-2xl overflow-hidden rounded-lg shadow-lg">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          <Image
            src={CAROUSEL_IMAGES[index]}
            alt={`Slide ${index + 1}`}
            fill
            className="object-cover"
            unoptimized
          />
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
        {CAROUSEL_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 w-2 rounded-full transition-colors ${
              i === index ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

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
      {/* Background layer — separated from content so brightness only dims the backdrop, not text/images on top */}
      {backgroundImageUrl && (
        <div
          className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat brightness-90"
          style={{ backgroundImage: `url(${backgroundImageUrl})` }}
        >
          <div className="absolute inset-0 bg-background/40" />
        </div>
      )}

      <div className="container mx-auto flex flex-col items-center px-4 py-10">
        {isAdmin && !loadingSettings && (
          <div className="mb-6 flex flex-wrap justify-center gap-3">
            <Button
              className="rounded-full"
              onClick={() => setBackgroundDialogOpen(true)}
            >
              Change Background
            </Button>
            <Button
              className="rounded-full"
              onClick={() => setMainImageDialogOpen(true)}
            >
              Change Main Image
            </Button>
          </div>
        )}

        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 p-3 text-center text-3xl font-bold text-white md:text-4xl"
        >
          CORNERSTONE IN TH3 SPIRIT
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          className="relative mb-8 aspect-video w-full max-w-xl overflow-hidden rounded-lg shadow-lg"
        >
          <Image
            src="https://raw.githubusercontent.com/Gotcha1001/My-Images-for-sites-Wes/main/JoshLogo.JPG"
            alt="Josh's Art Logo"
            fill
            className="object-contain"
            priority
          />
        </motion.div>

        {mainImageUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            whileHover={{ scale: 1.02 }}
            className="relative mb-8 aspect-video w-full max-w-xl overflow-hidden rounded-lg shadow-lg"
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

        <HeroCarousel />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-8 w-full max-w-xl"
        >
          <Card className="overflow-hidden">
            <CardContent>
              <h2 className="mb-4 text-center text-xl font-semibold">
                Josh&apos;s Latest Video
              </h2>
              <div className="relative aspect-video overflow-hidden rounded-lg">
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

        <div className="mt-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GRID_IMAGES.map((src, i) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileHover={{ scale: 1.05 }}
              className="relative h-64 w-full overflow-hidden rounded-lg shadow-lg"
            >
              <Image
                src={src}
                alt="Artwork"
                fill
                className="object-cover"
                unoptimized
              />
            </motion.div>
          ))}
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
