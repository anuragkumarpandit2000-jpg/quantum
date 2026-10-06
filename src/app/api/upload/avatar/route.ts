import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function detectImageType(buffer: Buffer): "png" | "jpg" | "webp" | null {
  if (buffer.length < 12) return null;

  // PNG: 89 50 4E 47
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return "png";
  }

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "jpg";
  }

  // WebP: 'RIFF' + 4 bytes + 'WEBP'
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return "webp";
  }

  return null;
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contentType = req.headers.get("content-type") || "";
    let buffer: Buffer;

    if (contentType.includes("application/json")) {
      const body = await req.json();
      const imageStr: string = body.image || "";

      if (!imageStr || !imageStr.startsWith("data:image/")) {
        return NextResponse.json(
          { error: "Invalid image format. Expected base64 data URL." },
          { status: 400 }
        );
      }

      const match = imageStr.match(/^data:image\/[a-zA-Z0-9+]+;base64,(.+)$/);
      if (!match) {
        return NextResponse.json(
          { error: "Malformed base64 image data." },
          { status: 400 }
        );
      }

      buffer = Buffer.from(match[1], "base64");
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: "Image file exceeds maximum allowable size of 5MB." },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } else {
      return NextResponse.json({ error: "Unsupported Content-Type" }, { status: 400 });
    }

    // Size limit check
    if (buffer.length > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Image file exceeds maximum allowable size of 5MB." },
        { status: 400 }
      );
    }

    // Magic bytes verification to prevent arbitrary file upload attacks
    const extension = detectImageType(buffer);
    if (!extension) {
      return NextResponse.json(
        { error: "Invalid file content. Only genuine PNG, JPEG, and WebP images are permitted." },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", "avatars");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filename = `avatar-${user.id}-${Date.now()}-${crypto.randomBytes(4).toString("hex")}.${extension}`;
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
