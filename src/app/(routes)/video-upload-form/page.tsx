"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { motion } from "framer-motion";
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
import { cn } from "@/lib/utils";

const videoSchema = z.object({
  title: z.string().min(2, "Title is required"),
  artBy: z.string().min(2, "Please credit the artist"),
  content: z.string().min(5, "Content is required"),
});

type VideoFormValues = z.infer<typeof videoSchema>;

type VideoMode = "link" | "upload";

export default function VideoUploadFormPage() {
  const router = useRouter();
  const { user, isAdmin, loading: authLoading } = useAuth();

  const { control, handleSubmit, reset } = useForm<VideoFormValues>({
    resolver: zodResolver(videoSchema),
    defaultValues: { title: "", artBy: "", content: "" },
  });

  const [videoMode, setVideoMode] = useState<VideoMode>("link");
  const [linkUrl, setLinkUrl] = useState("");
  const [uploadResult, setUploadResult] =
    useState<CloudinaryUploadResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.replace("/art-videos");
    }
  }, [authLoading, isAdmin, router]);

  const videoUrl = videoMode === "link" ? linkUrl : (uploadResult?.url ?? "");

  const switchMode = (mode: VideoMode) => {
    setVideoMode(mode);
    setLinkUrl("");
    setUploadResult(null);
  };

  const onSubmit = async (values: VideoFormValues) => {
    if (!videoUrl) {
      setError("Please paste a video link or upload a video file.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await addDoc(collection(db, "art-video"), {
        title: values.title,
        artBy: values.artBy,
        content: values.content,
        videoUrl,
        videoPublicId: uploadResult?.publicId ?? null,
        date: Timestamp.now(),
        userName: user?.displayName || user?.email || "",
      });
      reset();
      setLinkUrl("");
      setUploadResult(null);
      router.push("/art-videos");
    } catch (err) {
      console.error(err);
      setError("Something went wrong uploading this video. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return <Spinner fullScreen label="Checking access..." />;
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
            <CardTitle>Upload Video</CardTitle>
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

                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="secondary"
                    render={<Link href="/art-videos" />}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Uploading..." : "Upload"}
                  </Button>
                </div>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
