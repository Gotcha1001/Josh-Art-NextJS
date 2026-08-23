"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, X, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/shared/spinner";
import { cn } from "@/lib/utils";

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
}

interface CloudinaryUploaderProps {
  resourceType?: "image" | "video";
  value?: string;
  onUploadComplete: (result: CloudinaryUploadResult) => void;
  onRemove?: () => void;
  label?: string;
  className?: string;
}

export function CloudinaryUploader({
  resourceType = "image",
  value,
  onUploadComplete,
  onRemove,
  label,
  className,
}: CloudinaryUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(value ?? null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File) => {
    setError(null);
    setUploading(true);

    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("resourceType", resourceType);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();

      // /api/upload returns { url, publicId, resourceType } — not
      // Cloudinary's raw secure_url/public_id field names.
      setPreview(data.url);
      onUploadComplete({ url: data.url, publicId: data.publicId });
    } catch (err) {
      console.error(err);
      setError("Something went wrong uploading that file. Please try again.");
      setPreview(value ?? null);
    } finally {
      setUploading(false);
      URL.revokeObjectURL(localUrl);
    }
  };

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    upload(file);
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
    onRemove?.();
  };

  return (
    <div className={cn("w-full", className)}>
      {label && <p className="mb-2 text-sm font-medium">{label}</p>}

      <input
        ref={inputRef}
        type="file"
        accept={resourceType === "video" ? "video/*" : "image/*"}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <AnimatePresence mode="wait">
        {preview ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative overflow-hidden rounded-lg border bg-muted"
          >
            {resourceType === "video" ? (
              <video
                src={preview}
                controls
                className="aspect-video w-full object-cover"
              />
            ) : (
              <div className="relative aspect-video w-full">
                <Image
                  src={preview}
                  alt="Upload preview"
                  fill
                  className="object-cover"
                  unoptimized={preview.startsWith("blob:")}
                />
              </div>
            )}

            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/70">
                <Spinner size="md" label="Uploading..." />
              </div>
            )}

            {!uploading && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute right-2 top-2 h-8 w-8"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.button
            key="dropzone"
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              handleFiles(e.dataTransfer.files);
            }}
            className={cn(
              "flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed text-muted-foreground transition-colors",
              dragActive
                ? "border-primary bg-primary/5 text-primary"
                : "border-border hover:border-primary/50",
            )}
          >
            {resourceType === "video" ? (
              <Film className="h-8 w-8" />
            ) : (
              <UploadCloud className="h-8 w-8" />
            )}
            <span className="text-sm">
              Drag & drop or click to upload{" "}
              {resourceType === "video" ? "a video" : "an image"}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  );
}
