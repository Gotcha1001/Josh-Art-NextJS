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

const gallerySchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().max(500, "Keep it under 500 characters").optional(),
  price: z.string().optional(),
});

type GalleryFormValues = z.infer<typeof gallerySchema>;

export default function GalleryAlterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { isAdmin, loading: authLoading } = useAuth();

  const { control, handleSubmit, reset } = useForm<GalleryFormValues>({
    resolver: zodResolver(gallerySchema),
    defaultValues: { title: "", description: "", price: "" },
  });

  const [uploadResult, setUploadResult] =
    useState<CloudinaryUploadResult | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | undefined>(
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
      router.replace("/gallery");
    }
  }, [authLoading, isAdmin, router]);

  useEffect(() => {
    if (!id) return; // nothing to fetch — notFound was already set from initial state

    (async () => {
      try {
        const snap = await getDoc(doc(db, "gallery", id));
        if (!snap.exists()) {
          setNotFound(true);
          return;
        }
        const data = snap.data();
        reset({
          title: data.title ?? "",
          description: data.description ?? "",
          price: data.price ?? "",
        });
        setExistingImageUrl(data.imageUrl);
      } catch (err) {
        console.error(err);
        setError("Couldn't load this piece. Please try again.");
      } finally {
        setLoadingItem(false);
      }
    })();
  }, [id, reset]);

  const onSubmit = async (values: GalleryFormValues) => {
    if (!id) return;
    setError(null);
    setSubmitting(true);
    try {
      await updateDoc(doc(db, "gallery", id), {
        title: values.title,
        description: values.description ?? "",
        price: values.price ?? "",
        ...(uploadResult && {
          imageUrl: uploadResult.url,
          imagePublicId: uploadResult.publicId,
        }),
      });
      router.push("/gallery");
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
      await deleteDoc(doc(db, "gallery", id));
      router.push("/gallery");
    } catch (err) {
      console.error(err);
      setError("Couldn't delete this piece. Please try again.");
      setDeleting(false);
    }
  };

  if (authLoading || loadingItem) {
    return <Spinner fullScreen label="Loading piece..." />;
  }

  if (notFound) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold">Piece not found</h1>
        <p className="mt-2 text-muted-foreground">
          This gallery item may have already been removed.
        </p>
        <Button className="mt-6" render={<Link href="/gallery" />}>
          Back to Gallery
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
            <CardTitle>Edit Gallery Piece</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FieldGroup>
                <CloudinaryUploader
                  resourceType="image"
                  label="Artwork Image"
                  value={existingImageUrl}
                  onUploadComplete={setUploadResult}
                  onRemove={() => setUploadResult(null)}
                />
                {error && <p className="text-sm text-destructive">{error}</p>}

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

                <div className="flex items-center justify-between gap-3">
                  <Dialog>
                    <DialogTrigger
                      render={<Button type="button" variant="destructive" />}
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete this piece?</DialogTitle>
                        <DialogDescription>
                          This can&apos;t be undone. The image and its details
                          will be removed from the gallery permanently.
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
                      render={<Link href="/gallery" />}
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
