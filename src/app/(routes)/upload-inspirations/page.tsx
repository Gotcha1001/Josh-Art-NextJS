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

const inspirationSchema = z.object({
  artistName: z.string().min(2, "Artist name must be at least 2 characters"),
  description: z.string().max(500, "Keep it under 500 characters").optional(),
  artistLink: z
    .string()
    .url("Enter a valid URL, e.g. https://instagram.com/...")
    .optional()
    .or(z.literal("")),
});

type InspirationFormValues = z.infer<typeof inspirationSchema>;

export default function UploadInspirationsPage() {
  const router = useRouter();
  const { isAdmin, loading: authLoading } = useAuth();

  const { control, handleSubmit } = useForm<InspirationFormValues>({
    resolver: zodResolver(inspirationSchema),
    defaultValues: { artistName: "", description: "", artistLink: "" },
  });

  const [uploadResult, setUploadResult] =
    useState<CloudinaryUploadResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.replace("/promoting-other-artists");
    }
  }, [authLoading, isAdmin, router]);

  const onSubmit = async (values: InspirationFormValues) => {
    if (!uploadResult) {
      setUploadError("Please upload an image before saving.");
      return;
    }
    setUploadError(null);
    setSubmitting(true);
    try {
      await addDoc(collection(db, "inspirations"), {
        artistName: values.artistName,
        description: values.description ?? "",
        artistLink: values.artistLink ?? "",
        imageUrl: uploadResult.url,
        imagePublicId: uploadResult.publicId,
        createdAt: Timestamp.now(),
      });
      router.push("/promoting-other-artists");
    } catch (err) {
      console.error(err);
      setUploadError(
        "Something went wrong saving this artist. Please try again.",
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
            <CardTitle>Feature an Artist</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FieldGroup>
                <CloudinaryUploader
                  resourceType="image"
                  label="Artist Image"
                  onUploadComplete={setUploadResult}
                  onRemove={() => setUploadResult(null)}
                />
                {uploadError && (
                  <p className="text-sm text-destructive">{uploadError}</p>
                )}

                <Controller
                  name="artistName"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Artist Name</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="e.g. Jane Doe"
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
                        placeholder="A short note on their work..."
                        rows={4}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="artistLink"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Artist Link</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="https://instagram.com/theirprofile"
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
                    render={<Link href="/promoting-other-artists" />}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Saving..." : "Save Artist"}
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
