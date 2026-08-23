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

const gallerySchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().max(500, "Keep it under 500 characters").optional(),
  price: z.string().optional(),
});

type GalleryFormValues = z.infer<typeof gallerySchema>;

export default function GalleryAddPage() {
  const router = useRouter();
  const { isAdmin, loading: authLoading } = useAuth();

  const { control, handleSubmit } = useForm<GalleryFormValues>({
    resolver: zodResolver(gallerySchema),
    defaultValues: { title: "", description: "", price: "" },
  });

  const [uploadResult, setUploadResult] =
    useState<CloudinaryUploadResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.replace("/gallery");
    }
  }, [authLoading, isAdmin, router]);

  const onSubmit = async (values: GalleryFormValues) => {
    if (!uploadResult) {
      setUploadError("Please upload an image before saving.");
      return;
    }
    setUploadError(null);
    setSubmitting(true);
    try {
      await addDoc(collection(db, "gallery"), {
        title: values.title,
        description: values.description ?? "",
        price: values.price ?? "",
        imageUrl: uploadResult.url,
        imagePublicId: uploadResult.publicId,
        createdAt: Timestamp.now(),
      });
      router.push("/gallery");
    } catch (err) {
      console.error(err);
      setUploadError(
        "Something went wrong saving this piece. Please try again.",
      );
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
            <CardTitle>Add a Gallery Piece</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FieldGroup>
                <CloudinaryUploader
                  resourceType="image"
                  label="Artwork Image"
                  onUploadComplete={setUploadResult}
                  onRemove={() => setUploadResult(null)}
                />
                {uploadError && (
                  <p className="text-sm text-destructive">{uploadError}</p>
                )}

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
                        placeholder="e.g. Sunset Over the Bluffs"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="description"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                      <Textarea
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="A short description of the piece..."
                        rows={4}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="price"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Price</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="e.g. R1,500 or Not for sale"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    render={<Link href="/gallery" />}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Saving..." : "Save Piece"}
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
