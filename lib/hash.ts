export async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  
  // Fallback for node or non-browser environments if subtle is missing
  try {
    const nodeCrypto = await import("crypto");
    return nodeCrypto.createHash("sha256").update(text).digest("hex");
  } catch {
    throw new Error("SHA-256 is not supported in this environment");
  }
}

