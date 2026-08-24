"use client";

import { Suspense, useEffect, useState } from "react";
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

// The actual page content, split out from the default export so the
// useSearchParams() call below can be wrapped in <Suspense>. Without that,
// Next.js can't statically prerender this route and the Vercel build fails
// with "Error occurred prerendering page".
function AlterInspirationsForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { isAdmin, loading: authLoading } = useAuth();

  const { control, handleSubmit, reset } = useForm<InspirationFormValues>({
    resolver: zodResolver(inspirationSchema),
    defaultValues: { artistName: "", description: "", artistLink: "" },
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
      router.replace("/promoting-other-artists");
    }
  }, [authLoading, isAdmin, router]);

  useEffect(() => {
    if (!id) return; // nothing to fetch — notFound was already set from initial state
    (async () => {
      try {
        const snap = await getDoc(doc(db, "inspirations", id));
        if (!snap.exists()) {
          setNotFound(true);
          return;
        }
        const data = snap.data();
        reset({
          artistName: data.artistName ?? "",
          description: data.description ?? "",
          artistLink: data.artistLink ?? "",
        });
        setExistingImageUrl(data.imageUrl);
      } catch (err) {
        console.error(err);
        setError("Couldn't load this artist. Please try again.");
      } finally {
        setLoadingItem(false);
      }
    })();
  }, [id, reset]);

  const onSubmit = async (values: InspirationFormValues) => {
    if (!id) return;
    setError(null);
    setSubmitting(true);
    try {
      await updateDoc(doc(db, "inspirations", id), {
        artistName: values.artistName,
        description: values.description ?? "",
        artistLink: values.artistLink ?? "",
        ...(uploadResult && {
          imageUrl: uploadResult.url,
          imagePublicId: uploadResult.publicId,
        }),
      });
      router.push("/promoting-other-artists");
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
      await deleteDoc(doc(db, "inspirations", id));
      router.push("/promoting-other-artists");
    } catch (err) {
      console.error(err);
      setError("Couldn't delete this artist. Please try again.");
      setDeleting(false);
    }
  };

  if (authLoading || loadingItem) {
    return <Spinner fullScreen label="Loading artist..." />;
  }

  if (notFound) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold">Artist not found</h1>
        <p className="mt-2 text-muted-foreground">
          This entry may have already been removed.
        </p>
        <Button
          className="mt-6"
          render={<Link href="/promoting-other-artists" />}
        >
          Back to Promoting Other Artists
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
            <CardTitle>Edit Featured Artist</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FieldGroup>
                <CloudinaryUploader
                  resourceType="image"
                  label="Artist Image"
                  value={existingImageUrl}
                  onUploadComplete={setUploadResult}
                  onRemove={() => setUploadResult(null)}
                />
                {error && <p className="text-sm text-destructive">{error}</p>}

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

                <div className="flex items-center justify-between gap-3">
                  <Dialog>
                    <DialogTrigger
                      render={<Button type="button" variant="destructive" />}
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Remove this artist?</DialogTitle>
                        <DialogDescription>
                          This can&apos;t be undone. The entry will be removed
                          from Promoting Other Artists permanently.
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
                      render={<Link href="/promoting-other-artists" />}
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

export default function AlterInspirationsPage() {
  return (
    <Suspense fallback={<Spinner fullScreen label="Loading artist..." />}>
      <AlterInspirationsForm />
    </Suspense>
  );
}
