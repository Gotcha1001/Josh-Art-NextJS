import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs"; // Cloudinary SDK needs the Node runtime, not edge

// Must match ADMIN_EMAIL in hooks/use-auth.ts
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@example.com";

// Verifies the Firebase ID token with Google (no firebase-admin needed)
// and returns the signed-in user's email, or null if the token is invalid.
async function getEmailFromIdToken(idToken: string): Promise<string | null> {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) return null;

  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    },
  );
  if (!res.ok) return null;

  const data = await res.json();
  return data?.users?.[0]?.email ?? null;
}

export async function POST(req: NextRequest) {
  // 1. Only the admin may delete files
  const authHeader = req.headers.get("authorization") ?? "";
  const idToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!idToken) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const email = await getEmailFromIdToken(idToken);
  if (!email || email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Not allowed." }, { status: 403 });
  }

  // 2. Validate the request
  let body: { publicId?: string; resourceType?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const publicId = body.publicId;
  const resourceType = body.resourceType === "video" ? "video" : "image";

  // Only allow deleting files inside the josh-art folder
  if (!publicId || !publicId.startsWith("josh-art/")) {
    return NextResponse.json({ error: "Invalid public ID." }, { status: 400 });
  }

  // 3. Delete from Cloudinary
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true,
    });

    // "ok" = deleted, "not found" = already gone (treated as success)
    if (result.result !== "ok" && result.result !== "not found") {
      return NextResponse.json(
        { error: "Cloudinary could not delete the file." },
        { status: 500 },
      );
    }

    return NextResponse.json({ result: result.result });
  } catch (err) {
    console.error("Cloudinary delete error:", err);
    return NextResponse.json(
      { error: "Delete from Cloudinary failed." },
      { status: 500 },
    );
  }
}
