"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-5xl font-bold text-destructive">Oops!</h1>
      <p className="text-lg text-muted-foreground">
        Sorry, an unexpected error has occurred.
      </p>
      <div className="flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" render={<Link href="/" />}>
          Go Back Home
        </Button>
      </div>
    </div>
  );
}
