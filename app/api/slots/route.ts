import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { defaultSlots, type ContentSlot } from "@/content/slots";

const jsonFilePath = path.join(process.cwd(), "content", "slots.json");

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getSlotsFromDisk(): ContentSlot[] {
  try {
    if (!fs.existsSync(jsonFilePath)) {
      fs.writeFileSync(jsonFilePath, JSON.stringify(defaultSlots, null, 2), "utf-8");
      return defaultSlots;
    }
    const raw = fs.readFileSync(jsonFilePath, "utf-8");
    return JSON.parse(raw) as ContentSlot[];
  } catch (err) {
    console.error("Error reading slots.json:", err);
    return defaultSlots;
  }
}

function saveSlotsToDisk(slots: ContentSlot[]): void {
  const dir = path.dirname(jsonFilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(jsonFilePath, JSON.stringify(slots, null, 2), "utf-8");
}

export async function GET() {
  const slots = getSlotsFromDisk();
  return NextResponse.json(
    { success: true, slots },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
}

export async function POST(req: NextRequest) {
  try {
    const newSlot: ContentSlot = await req.json();
    if (!newSlot.id) {
      return NextResponse.json(
        { success: false, error: "ID slot harus diisi" },
        { status: 400 }
      );
    }

    const slots = getSlotsFromDisk();
    const existingIndex = slots.findIndex((s) => s.id === newSlot.id);
    if (existingIndex >= 0) {
      return NextResponse.json(
        { success: false, error: `Slot dengan ID ${newSlot.id} sudah ada` },
        { status: 409 }
      );
    }

    const updated = [...slots, newSlot];
    saveSlotsToDisk(updated);
    return NextResponse.json({ success: true, slots: updated, slot: newSlot });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal menambahkan slot";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    // Reorder or bulk update: { slots: ContentSlot[] }
    if (Array.isArray(body.slots)) {
      saveSlotsToDisk(body.slots);
      return NextResponse.json({ success: true, slots: body.slots });
    }

    // Single slot update: ContentSlot or { slot: ContentSlot }
    const slotToUpdate: ContentSlot = body.slot || body;
    if (!slotToUpdate.id) {
      return NextResponse.json(
        { success: false, error: "ID slot diperlukan" },
        { status: 400 }
      );
    }

    const slots = getSlotsFromDisk();
    const index = slots.findIndex((s) => s.id === slotToUpdate.id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: `Slot ${slotToUpdate.id} tidak ditemukan` },
        { status: 404 }
      );
    }

    slots[index] = { ...slots[index], ...slotToUpdate };
    saveSlotsToDisk(slots);

    return NextResponse.json({ success: true, slots, slot: slots[index] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal memperbarui slot";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID slot diperlukan" },
        { status: 400 }
      );
    }

    const slots = getSlotsFromDisk();
    const filtered = slots.filter((s) => s.id !== id);

    if (filtered.length === slots.length) {
      return NextResponse.json(
        { success: false, error: `Slot ${id} tidak ditemukan` },
        { status: 404 }
      );
    }

    saveSlotsToDisk(filtered);
    return NextResponse.json({ success: true, slots: filtered });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal menghapus slot";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

