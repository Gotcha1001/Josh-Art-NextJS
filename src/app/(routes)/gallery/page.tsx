"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { ImageOff, Pencil, Plus } from "lucide-react";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import { Spinner } from "@/components/shared/spinner";
import { Pagination } from "@/components/shared/pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  price?: string;
}

const ITEMS_PER_PAGE = 9;

export default function GalleryPage() {
  const { isAdmin } = useAuth();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    (async () => {
      try {
        const q = query(
          collection(db, "gallery"),
          orderBy("createdAt", "desc"),
        );
        const snap = await getDocs(q);
        setItems(
          snap.docs.map((d) => ({ id: d.id, ...d.data() }) as GalleryItem),
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalPages = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE));
  const pageItems = items.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  if (loading) {
    return <Spinner fullScreen label="Loading gallery..." />;
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gallery</h1>
          <p className="text-muted-foreground">
            A collection of original pieces
          </p>
        </div>
        {isAdmin && (
          <Button className="gap-1" render={<Link href="/gallery/add" />}>
            <Plus className="h-4 w-4" /> Add Piece
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <p className="py-20 text-center text-muted-foreground">
          No pieces in the gallery yet.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pageItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="overflow-hidden pt-0">
                  <div className="relative aspect-square w-full">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                        <ImageOff className="h-8 w-8" />
                      </div>
                    )}
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="font-semibold">{item.title}</h3>
                    {item.description && (
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    )}
                    {item.price && (
                      <p className="mt-1 text-sm font-medium">{item.price}</p>
                    )}
                  </CardContent>
                  {isAdmin && (
                    <CardFooter>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-1"
                        render={<Link href={`/gallery/alter?id=${item.id}`} />}
                      >
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </>
      )}
    </div>
  );
}
