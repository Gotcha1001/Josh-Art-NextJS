import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs"; // Cloudinary SDK needs the Node runtime, not edge

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const resourceType =
    formData.get("resourceType") === "video" ? "video" : "image";

  if (!file) {
    return NextResponse.json(
      { error: "No file was received." },
      { status: 400 },
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    const result = await new Promise<{
      secure_url: string;
      public_id: string;
      resource_type: string;
    }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "josh-art", resource_type: resourceType },
        (err, result) => {
          if (err || !result) return reject(err);
          resolve(result as any);
        },
      );
      stream.end(buffer);
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
    });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return NextResponse.json(
      { error: "Upload to Cloudinary failed." },
      { status: 500 },
    );
  }
}
