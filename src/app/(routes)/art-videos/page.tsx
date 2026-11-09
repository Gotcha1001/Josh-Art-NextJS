"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import { Spinner } from "@/components/shared/spinner";
import { Pagination } from "@/components/shared/pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface VideoItem {
  id: string;
  title: string;
  artBy?: string;
  content?: string;
  videoUrl: string;
  videoPublicId?: string | null;
}

const ITEMS_PER_PAGE = 6;

// Direct video files (Cloudinary uploads, .mp4 etc.) can play in a <video> tag.
// Pasted YouTube/Facebook links cannot, so those open in a new tab instead.
function isDirectVideo(url: string) {
  return (
    url.includes("res.cloudinary.com") ||
    /\.(mp4|webm|mov|m4v|ogg)(\?|$)/i.test(url)
  );
}

export default function ArtVideosPage() {
  const { user, isAdmin } = useAuth();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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

  const handleDelete = async (video: VideoItem) => {
    setDeletingId(video.id);
    setDeleteError(null);
    try {
      // 1. Delete the file from Cloudinary (only for uploaded files, not pasted links)
      if (video.videoPublicId) {
        const idToken = await user?.getIdToken();
        const res = await fetch("/api/delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            publicId: video.videoPublicId,
            resourceType: "video",
          }),
        });
        if (!res.ok) throw new Error("Cloudinary delete failed");
      }

      // 2. Delete the record from Firestore
      await deleteDoc(doc(db, "videos", video.id));
      setVideos((prev) => prev.filter((v) => v.id !== video.id));
    } catch (err) {
      console.error(err);
      setDeleteError("Couldn't delete this video. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(videos.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = videos.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
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

      {deleteError && (
        <p className="mb-4 text-sm text-red-300">{deleteError}</p>
      )}

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
                  <div className="relative flex aspect-video w-full items-center justify-center bg-black">
                    {isDirectVideo(video.videoUrl) ? (
                      <video
                        src={video.videoUrl}
                        controls
                        preload="metadata"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Button
                        variant="secondary"
                        className="gap-1"
                        render={
                          <a
                            href={video.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          />
                        }
                      >
                        <ExternalLink className="h-4 w-4" /> Watch video
                      </Button>
                    )}
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="font-semibold">{video.title}</h3>
                    {video.artBy && (
                      <p className="text-sm text-muted-foreground">
                        Art by {video.artBy}
                      </p>
                    )}
                    {video.content && (
                      <p className="mt-1 line-clamp-2 whitespace-pre-wrap text-sm text-muted-foreground">
                        {video.content}
                      </p>
                    )}
                  </CardContent>
                  {isAdmin && (
                    <CardFooter className="gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-1"
                        render={<Link href={`/video-update?id=${video.id}`} />}
                      >
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </Button>
                      <Dialog>
                        <DialogTrigger
                          render={
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="flex-1 gap-1"
                            />
                          }
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete this video?</DialogTitle>
                            <DialogDescription>
                              This can&apos;t be undone. The video and its
                              details will be removed permanently.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button
                              variant="destructive"
                              onClick={() => handleDelete(video)}
                              disabled={deletingId === video.id}
                            >
                              {deletingId === video.id
                                ? "Deleting..."
                                : "Yes, Delete"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </CardFooter>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </>
      )}
    </div>
  );
}
