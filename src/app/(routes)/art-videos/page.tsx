"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { Pencil, Plus } from "lucide-react";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import { Spinner } from "@/components/shared/spinner";
import { Pagination } from "@/components/shared/pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface VideoItem {
  id: string;
  title: string;
  description?: string;
  videoUrl: string;
}

const ITEMS_PER_PAGE = 6;

export default function ArtVideosPage() {
  const { isAdmin } = useAuth();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    (async () => {
      try {
        const q = query(collection(db, "videos"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        setVideos(
          snap.docs.map((d) => ({ id: d.id, ...d.data() }) as VideoItem),
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalPages = Math.max(1, Math.ceil(videos.length / ITEMS_PER_PAGE));
  const pageItems = videos.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  if (loading) {
    return <Spinner fullScreen label="Loading videos..." />;
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Art Videos</h1>
          <p className="text-muted-foreground">
            Process videos, time-lapses, and demos
          </p>
        </div>
        {isAdmin && (
          <Button className="gap-1" render={<Link href="/video-upload-form" />}>
            <Plus className="h-4 w-4" /> Add Video
          </Button>
        )}
      </div>

      {videos.length === 0 ? (
        <p className="py-20 text-center text-muted-foreground">
          No videos uploaded yet.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pageItems.map((video, i) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="overflow-hidden pt-0">
                  <div className="relative aspect-video w-full bg-black">
                    <video
                      src={video.videoUrl}
                      controls
                      preload="metadata"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="font-semibold">{video.title}</h3>
                    {video.description && (
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {video.description}
                      </p>
                    )}
                  </CardContent>
                  {isAdmin && (
                    <CardFooter>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-1"
                        render={<Link href={`/video-update?id=${video.id}`} />}
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
