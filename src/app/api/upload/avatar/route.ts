import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let base64Data = "";
    let extension = "png";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      const imageStr: string = body.image || "";

      if (!imageStr || !imageStr.startsWith("data:image/")) {
        return NextResponse.json(
          { error: "Invalid image format. Expected base64 data URL." },
          { status: 400 }
        );
      }

      // Extract format
      const match = imageStr.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (!match) {
        return NextResponse.json(
          { error: "Malformed base64 image data." },
          { status: 400 }
        );
      }

      const mimeType = match[1].toLowerCase();
      if (mimeType.includes("jpeg") || mimeType.includes("jpg")) {
        extension = "jpg";
      } else if (mimeType.includes("webp")) {
        extension = "webp";
      } else {
        extension = "png";
      }

      base64Data = match[2];
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const ext = file.type.includes("jpeg") || file.type.includes("jpg") ? "jpg" : file.type.includes("webp") ? "webp" : "png";
      
      const uploadDir = path.join(process.cwd(), "public", "uploads", "avatars");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filename = `avatar-${Date.now()}-${crypto.randomBytes(4).toString("hex")}.${ext}`;
      const filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, buffer);

      return NextResponse.json({ url: `/uploads/avatars/${filename}` }, { status: 201 });
    } else {
      return NextResponse.json({ error: "Unsupported Content-Type" }, { status: 400 });
    }

    const buffer = Buffer.from(base64Data, "base64");

    // Size limit check (max 5MB)
    if (buffer.length > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image file exceeds maximum allowable size of 5MB." },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", "avatars");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filename = `avatar-${Date.now()}-${crypto.randomBytes(4).toString("hex")}.${extension}`;
    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({ url: `/uploads/avatars/${filename}` }, { status: 201 });
  } catch (error) {
    console.error("Avatar upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload and store avatar." },
      { status: 500 }
    );
  }
}
