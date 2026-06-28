const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const bucket = "recap-media";
const maxUploadFileBytes = 80 * 1024 * 1024;

function safeFileName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "media";
}

function safeFolder(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9/-]+/g, "-").replace(/\/+/g, "/").replace(/^\/+|\/+$/g, "") || "uploads";
}

function encodePath(path: string) {
  return path.split("/").map(encodeURIComponent).join("/");
}

export async function POST(request: Request) {
  if (!supabaseUrl || !serviceRoleKey) {
    return Response.json({ error: "Supabase media uploads are not configured" }, { status: 503 });
  }

  try {
    const { fileName, folder, size } = await request.json() as { fileName?: string; folder?: string; size?: number };
    if (!fileName) return Response.json({ error: "Missing file name" }, { status: 400 });
    if (Number(size) > maxUploadFileBytes) return Response.json({ error: "File is too large" }, { status: 413 });

    const objectPath = `${safeFolder(folder ?? "uploads")}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeFileName(fileName)}`;
    const encodedObjectPath = encodePath(objectPath);
    const signedResponse = await fetch(`${supabaseUrl}/storage/v1/object/upload/sign/${bucket}/${encodedObjectPath}`, {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        authorization: `Bearer ${serviceRoleKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ upsert: false }),
    });

    if (!signedResponse.ok) {
      const message = await signedResponse.text();
      return Response.json({ error: message || "Unable to prepare media upload" }, { status: signedResponse.status });
    }

    const signed = await signedResponse.json() as { signedURL?: string; signedUrl?: string; url?: string; token?: string };
    const token = signed.token ?? new URLSearchParams((signed.signedURL ?? signed.signedUrl ?? signed.url ?? "").split("?")[1] ?? "").get("token");
    const uploadUrl = `${supabaseUrl}/storage/v1/object/upload/sign/${bucket}/${encodedObjectPath}${token ? `?token=${encodeURIComponent(token)}` : ""}`;
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${encodedObjectPath}`;

    return Response.json({ path: objectPath, uploadUrl, publicUrl });
  } catch {
    return Response.json({ error: "Unable to prepare media upload" }, { status: 500 });
  }
}
