"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { ExternalLink, Pencil, Plus } from "lucide-react";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import { Spinner } from "@/components/shared/spinner";
import { Pagination } from "@/components/shared/pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface InspirationItem {
  id: string;
  artistName: string;
  imageUrl: string;
  description?: string;
  artistLink?: string;
}

const ITEMS_PER_PAGE = 9;

export default function PromotingOtherArtistsPage() {
  const { isAdmin } = useAuth();
  const [items, setItems] = useState<InspirationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    (async () => {
      try {
        const q = query(
          collection(db, "inspirations"),
          orderBy("createdAt", "desc"),
        );
        const snap = await getDocs(q);
        setItems(
          snap.docs.map((d) => ({ id: d.id, ...d.data() }) as InspirationItem),
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
    return <Spinner fullScreen label="Loading artists..." />;
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Promoting Other Artists</h1>
          <p className="text-muted-foreground">
            A few artists whose work is worth a look
          </p>
        </div>
        {isAdmin && (
          <Button
            className="gap-1"
            render={<Link href="/upload-inspirations" />}
          >
            <Plus className="h-4 w-4" /> Add Artist
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <p className="py-20 text-center text-muted-foreground">
          No artists featured yet.
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
                    <Image
                      src={item.imageUrl}
                      alt={item.artistName}
                      fill
                      className="object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="font-semibold">{item.artistName}</h3>
                    {item.description && (
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    )}
                    {item.artistLink && (
                      <a
                        href={item.artistLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                      >
                        View their work <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </CardContent>
                  {isAdmin && (
                    <CardFooter>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-1"
                        render={
                          <Link href={`/alter-inspirations?id=${item.id}`} />
                        }
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
