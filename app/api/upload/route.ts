import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";
import heicConvert from "heic-convert";
import sharp from "sharp";

const execFileAsync = promisify(execFile);

export const dynamic = "force-dynamic";
export const maxDuration = 120;

// Maximum file size: 250MB for video, 25MB for photo/audio
const MAX_VIDEO_SIZE = 250 * 1024 * 1024;
const MAX_IMAGE_SIZE = 25 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const category = (formData.get("category") as string) || "photos"; // "videos" | "photos" | "posters" | "audio"

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Tidak ada file yang dikirim" },
        { status: 400 }
      );
    }

    const mime = file.type.toLowerCase();
    const fileNameLower = file.name.toLowerCase();
    const isVideo = mime.startsWith("video/") || /\.(mp4|mov|webm|m4v)$/i.test(fileNameLower);
    const isImage =
      mime.startsWith("image/") ||
      /\.(jpg|jpeg|png|webp|avif|gif|heic|heif)$/i.test(fileNameLower);
    const isAudio = mime.startsWith("audio/") || /\.(mp3|wav|m4a|aac|ogg)$/i.test(fileNameLower);

    // Validate size
    if (isVideo && file.size > MAX_VIDEO_SIZE) {
      return NextResponse.json(
        { success: false, error: "Ukuran video maksimal 50 MB" },
        { status: 400 }
      );
    }
    if ((isImage || isAudio) && file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { success: false, error: "Ukuran file gambar/audio maksimal 20 MB" },
        { status: 400 }
      );
    }

    // Determine subfolder
    let subfolder = "photos";
    if (category === "videos" || isVideo) subfolder = "videos";
    else if (category === "posters") subfolder = "posters";
    else if (category === "audio" || isAudio) subfolder = "audio";
    else if (category === "photos" || isImage) subfolder = "photos";

    const uploadDir = path.join(process.cwd(), "public", "uploads", subfolder);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Read bytes
    const arrayBuffer = await file.arrayBuffer();
    let buffer = Buffer.from(arrayBuffer);
    let ext = path.extname(file.name) || (isVideo ? ".mp4" : isImage ? ".jpg" : ".mp3");

    // Convert Apple HEIC/HEIF photos to standard JPEG so browsers on Windows/Android can display them
    if (isImage) {
      const headerStr = buffer.length >= 12 ? buffer.slice(4, 12).toString("ascii") : "";
      const isHeic =
        headerStr.includes("ftyp") ||
        /\.(heic|heif)$/i.test(fileNameLower);

      if (isHeic) {
        try {
          const converted = await heicConvert({
            buffer,
            format: "JPEG",
            quality: 0.9,
          });
          buffer = Buffer.from(converted);
        } catch (convertErr) {
          console.warn("HEIC conversion skipped:", convertErr);
        }
      }

      // Auto-orient according to EXIF and optimize image size (max 1080x1920 Full HD for vertical feed)
      try {
        buffer = await sharp(buffer)
          .rotate() // Auto-rotates according to EXIF orientation tag
          .resize({
            width: 1080,
            height: 1920,
            fit: "inside",
            withoutEnlargement: true,
          })
          .jpeg({ quality: 85, progressive: true })
          .toBuffer();
        ext = ".jpg";
      } catch (sharpErr) {
        console.warn("Sharp image optimization skipped:", sharpErr);
      }
    }

    // Auto-compress large videos using ffmpeg (H.264 CRF 23 visually lossless, 1080p max width, faststart for streaming)
    if (isVideo) {
      const tempId = `${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      const tempInput = path.join(uploadDir, `tmp_in_${tempId}${ext}`);
      const tempOutput = path.join(uploadDir, `tmp_out_${tempId}.mp4`);

      try {
        fs.writeFileSync(tempInput, buffer);
        await execFileAsync("ffmpeg", [
          "-y",
          "-i",
          tempInput,
          "-c:v",
          "libx264",
          "-crf",
          "23",
          "-preset",
          "fast",
          "-movflags",
          "+faststart",
          "-vf",
          "scale=min(1080\\,iw):-2",
          "-c:a",
          "aac",
          "-b:a",
          "128k",
          tempOutput,
        ]);

        if (fs.existsSync(tempOutput) && fs.statSync(tempOutput).size > 0) {
          const compSize = fs.statSync(tempOutput).size;
          // Use compressed file if smaller or if converting non-mp4
          if (compSize < buffer.length || ext.toLowerCase() !== ".mp4") {
            buffer = fs.readFileSync(tempOutput);
            ext = ".mp4";
          }
        }
      } catch (ffmpegErr) {
        console.warn("FFmpeg compression skipped or not available:", ffmpegErr);
      } finally {
        if (fs.existsSync(tempInput)) {
          try {
            fs.unlinkSync(tempInput);
          } catch {}
        }
        if (fs.existsSync(tempOutput)) {
          try {
            fs.unlinkSync(tempOutput);
          } catch {}
        }
      }
    }

    // Sanitize filename
    const baseName = path
      .basename(file.name, path.extname(file.name))
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "_")
      .slice(0, 30);
    const uniqueSuffix = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const finalFilename = `${baseName}-${uniqueSuffix}${ext}`;
    const destinationPath = path.join(uploadDir, finalFilename);

    fs.writeFileSync(destinationPath, buffer);

    const publicUrl = `/uploads/${subfolder}/${finalFilename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: finalFilename,
      size: buffer.length,
      type: isImage && ext === ".jpg" ? "image/jpeg" : file.type,
      category: subfolder,
    });
  } catch (err: unknown) {
    console.error("Upload error:", err);
    const message = err instanceof Error ? err.message : "Gagal mengunggah file";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
