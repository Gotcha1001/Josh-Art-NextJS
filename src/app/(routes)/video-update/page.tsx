"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import {
  CloudinaryUploader,
  CloudinaryUploadResult,
} from "@/components/shared/cloudinary-uploader";
import { Spinner } from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const videoSchema = z.object({
  title: z.string().min(2, "Title is required"),
  artBy: z.string().min(2, "Please credit the artist"),
  content: z.string().min(5, "Content is required"),
});

type VideoFormValues = z.infer<typeof videoSchema>;
type VideoMode = "link" | "upload";

export default function VideoUpdatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { isAdmin, loading: authLoading } = useAuth();

  const { control, handleSubmit, reset } = useForm<VideoFormValues>({
    resolver: zodResolver(videoSchema),
    defaultValues: { title: "", artBy: "", content: "" },
  });

  const [videoMode, setVideoMode] = useState<VideoMode>("link");
  const [linkUrl, setLinkUrl] = useState("");
  const [uploadResult, setUploadResult] =
    useState<CloudinaryUploadResult | null>(null);
  const [existingVideoUrl, setExistingVideoUrl] = useState<string | undefined>(
    undefined,
  );

  // Derive the "no id" case from the initial value instead of setting it inside an effect.
  const [loadingItem, setLoadingItem] = useState(Boolean(id));
  const [notFound, setNotFound] = useState(!id);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.replace("/art-videos");
    }
  }, [authLoading, isAdmin, router]);

  useEffect(() => {
    if (!id) return; // nothing to fetch — notFound was already set from initial state
    (async () => {
      try {
        const snap = await getDoc(doc(db, "videos", id));
        if (!snap.exists()) {
          setNotFound(true);
          return;
        }
        const data = snap.data();
        reset({
          title: data.title ?? "",
          artBy: data.artBy ?? "",
          content: data.content ?? "",
        });
        setExistingVideoUrl(data.videoUrl);
        // If the stored video was uploaded to Cloudinary (not pasted as a link),
        // default the toggle to "upload" so the existing preview renders correctly.
        setVideoMode(data.videoPublicId ? "upload" : "link");
        if (!data.videoPublicId) {
          setLinkUrl(data.videoUrl ?? "");
        }
      } catch (err) {
        console.error(err);
        setError("Couldn't load this video. Please try again.");
      } finally {
        setLoadingItem(false);
      }
    })();
  }, [id, reset]);

  const switchMode = (mode: VideoMode) => {
    setVideoMode(mode);
    setLinkUrl("");
    setUploadResult(null);
  };

  const videoUrl =
    videoMode === "link"
      ? linkUrl
      : (uploadResult?.url ?? existingVideoUrl ?? "");

  const onSubmit = async (values: VideoFormValues) => {
    if (!id) return;
    if (!videoUrl) {
      setError("Please paste a video link or upload a video file.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await updateDoc(doc(db, "videos", id), {
        title: values.title,
        artBy: values.artBy,
        content: values.content,
        videoUrl,
        ...(uploadResult && {
          videoPublicId: uploadResult.publicId,
        }),
      });
      router.push("/art-videos");
    } catch (err) {
      console.error(err);
      setError("Something went wrong saving your changes. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setDeleting(true);
    try {
      await deleteDoc(doc(db, "videos", id));
      router.push("/art-videos");
    } catch (err) {
      console.error(err);
      setError("Couldn't delete this video. Please try again.");
      setDeleting(false);
    }
  };

  if (authLoading || loadingItem) {
    return <Spinner fullScreen label="Loading video..." />;
  }

  if (notFound) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold">Video not found</h1>
        <p className="mt-2 text-muted-foreground">
          This video may have already been removed.
        </p>
        <Button className="mt-6" render={<Link href="/art-videos" />}>
          Back to Art Videos
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Edit Video</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FieldGroup>
                <Controller
                  name="title"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="artBy"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Art By</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Field>
                  <FieldLabel>Video</FieldLabel>
                  <div className="mb-2 flex gap-4">
                    <button
                      type="button"
                      onClick={() => switchMode("link")}
                      className={cn(
                        "text-sm",
                        videoMode === "link"
                          ? "font-semibold text-foreground underline"
                          : "text-muted-foreground",
                      )}
                    >
                      Paste a link
                    </button>
                    <button
                      type="button"
                      onClick={() => switchMode("upload")}
                      className={cn(
                        "text-sm",
                        videoMode === "upload"
                          ? "font-semibold text-foreground underline"
                          : "text-muted-foreground",
                      )}
                    >
                      Upload a video file
                    </button>
                  </div>
                  {videoMode === "link" ? (
                    <Input
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      placeholder="https://facebook.com/... or https://youtube.com/..."
                    />
                  ) : (
                    <CloudinaryUploader
                      resourceType="video"
                      value={existingVideoUrl}
                      onUploadComplete={setUploadResult}
                      onRemove={() => setUploadResult(null)}
                    />
                  )}
                </Field>

                <Controller
                  name="content"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Content</FieldLabel>
                      <Textarea
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        rows={6}
                        className="resize-none whitespace-pre-wrap"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {error && <p className="text-sm text-destructive">{error}</p>}

                <div className="flex items-center justify-between gap-3">
                  <Dialog>
                    <DialogTrigger
                      render={<Button type="button" variant="destructive" />}
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete this video?</DialogTitle>
                        <DialogDescription>
                          This can&apos;t be undone. The video and its details
                          will be removed permanently.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant="destructive"
                          onClick={handleDelete}
                          disabled={deleting}
                        >
                          {deleting ? "Deleting..." : "Yes, Delete"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      render={<Link href="/art-videos" />}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={submitting}>
                      {submitting ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
