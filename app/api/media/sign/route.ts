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

function storageHeaders() {
  return {
    apikey: serviceRoleKey,
    authorization: `Bearer ${serviceRoleKey}`,
    "content-type": "application/json",
  };
}

async function ensureBucket() {
  const bucketResponse = await fetch(`${supabaseUrl}/storage/v1/bucket/${bucket}`, {
    headers: storageHeaders(),
  });

  if (!bucketResponse.ok) {
    const createResponse = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
      method: "POST",
      headers: storageHeaders(),
      body: JSON.stringify({
        id: bucket,
        name: bucket,
        public: true,
        file_size_limit: maxUploadFileBytes,
      }),
    });

    if (!createResponse.ok && createResponse.status !== 409) {
      const message = await createResponse.text();
      throw new Error(message || "Unable to create recap media bucket");
    }
  }

  const updateResponse = await fetch(`${supabaseUrl}/storage/v1/bucket/${bucket}`, {
    method: "PUT",
    headers: storageHeaders(),
    body: JSON.stringify({
      public: true,
      file_size_limit: maxUploadFileBytes,
    }),
  });

  if (!updateResponse.ok) {
    const message = await updateResponse.text();
    throw new Error(message || "Unable to update recap media bucket");
  }
}

export async function POST(request: Request) {
  if (!supabaseUrl || !serviceRoleKey) {
    return Response.json({ error: "Supabase media uploads are not configured" }, { status: 503 });
  }

  try {
    const { fileName, folder, size } = await request.json() as { fileName?: string; folder?: string; size?: number };
    if (!fileName) return Response.json({ error: "Missing file name" }, { status: 400 });
    if (Number(size) > maxUploadFileBytes) return Response.json({ error: "File is too large" }, { status: 413 });

    await ensureBucket();

    const objectPath = `${safeFolder(folder ?? "uploads")}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeFileName(fileName)}`;
    const encodedObjectPath = encodePath(objectPath);
    const signedResponse = await fetch(`${supabaseUrl}/storage/v1/object/upload/sign/${bucket}/${encodedObjectPath}`, {
      method: "POST",
      headers: storageHeaders(),
      body: JSON.stringify({ upsert: false }),
    });

    if (!signedResponse.ok) {
      const message = await signedResponse.text();
      return Response.json({
        error: message.includes("The related resource does not exist")
          ? "Supabase Storage could not find or create the recap-media bucket. Check Storage is enabled for this project."
          : message || "Unable to prepare media upload",
      }, { status: signedResponse.status });
    }

    const signed = await signedResponse.json() as { signedURL?: string; signedUrl?: string; url?: string; token?: string };
    const token = signed.token ?? new URLSearchParams((signed.signedURL ?? signed.signedUrl ?? signed.url ?? "").split("?")[1] ?? "").get("token");
    const uploadUrl = `${supabaseUrl}/storage/v1/object/upload/sign/${bucket}/${encodedObjectPath}${token ? `?token=${encodeURIComponent(token)}` : ""}`;
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${encodedObjectPath}`;

    return Response.json({ path: objectPath, uploadUrl, publicUrl });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unable to prepare media upload" }, { status: 500 });
  }
}
