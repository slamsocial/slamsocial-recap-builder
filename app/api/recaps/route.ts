type Metric = { label: string; value: string; note: string };
type Platform = { name: string; enabled: boolean; posts: string; views: string; engagements: string; er: string; cpm: string };
type Upload = { title: string; platform: string; url: string; views: string; likes: string; comments: string; shares: string; saves: string; reposts: string };
type ContentItem = { title: string; format: string; platform: string; mediaUrl: string; mediaType: "image" | "video"; aspect: "4 / 5" | "9 / 16" | "1 / 1" | "16 / 9" };
type OrganicItem = { title: string; type: string; url: string };
type Recap = {
  id: string;
  slug: string;
  client: string;
  campaign: string;
  period: string;
  objective: string;
  headline: string;
  clientLogoUrl: string;
  clientLogoName: string;
  insightDriveUrl: string;
  contentDriveUrl: string;
  pink58Url: string;
  pink58Password: string;
  includePink58: boolean;
  includeOrganic: boolean;
  includeRecommendations: boolean;
  metrics: Metric[];
  platforms: Platform[];
  uploads: Upload[];
  content: ContentItem[];
  organic: OrganicItem[];
  pink58: Metric[];
  recommendations: string;
  methodology: string;
  updatedAt: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

function configured() {
  return Boolean(supabaseUrl && serviceRoleKey);
}

function headers(prefer?: string) {
  return {
    apikey: serviceRoleKey,
    authorization: `Bearer ${serviceRoleKey}`,
    "content-type": "application/json",
    ...(prefer ? { prefer } : {}),
  };
}

async function supabase(path: string, init: RequestInit = {}) {
  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...init,
    headers: { ...headers(), ...(init.headers ?? {}) },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Supabase request failed: ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

function baseRow(recap: Recap) {
  return {
    slug: recap.slug,
    client: recap.client,
    campaign: recap.campaign,
    period: recap.period,
    objective: recap.objective,
    headline: recap.headline,
    client_logo_url: recap.clientLogoUrl,
    client_logo_name: recap.clientLogoName,
    insight_drive_url: recap.insightDriveUrl,
    content_drive_url: recap.contentDriveUrl,
    pink58_url: recap.pink58Url,
    pink58_password: recap.pink58Password,
    include_pink58: recap.includePink58,
    include_organic: recap.includeOrganic,
    include_recommendations: recap.includeRecommendations,
    recommendations: recap.recommendations,
    methodology: recap.methodology,
    published: true,
  };
}

function toRecap(row: Record<string, unknown>, children: {
  metrics: Record<string, unknown>[];
  platforms: Record<string, unknown>[];
  uploads: Record<string, unknown>[];
  content: Record<string, unknown>[];
  organic: Record<string, unknown>[];
}): Recap {
  const metricRows = children.metrics.sort((a, b) => Number(a.sort_order) - Number(b.sort_order));

  return {
    id: String(row.id),
    slug: String(row.slug ?? ""),
    client: String(row.client ?? ""),
    campaign: String(row.campaign ?? ""),
    period: String(row.period ?? ""),
    objective: String(row.objective ?? ""),
    headline: String(row.headline ?? ""),
    clientLogoUrl: String(row.client_logo_url ?? ""),
    clientLogoName: String(row.client_logo_name ?? ""),
    insightDriveUrl: String(row.insight_drive_url ?? ""),
    contentDriveUrl: String(row.content_drive_url ?? ""),
    pink58Url: String(row.pink58_url ?? ""),
    pink58Password: String(row.pink58_password ?? ""),
    includePink58: Boolean(row.include_pink58),
    includeOrganic: Boolean(row.include_organic),
    includeRecommendations: Boolean(row.include_recommendations),
    metrics: metricRows.filter((item) => item.metric_group === "hero").map((item) => ({
      label: String(item.label ?? ""),
      value: String(item.value ?? ""),
      note: String(item.note ?? ""),
    })),
    pink58: metricRows.filter((item) => item.metric_group === "pink58").map((item) => ({
      label: String(item.label ?? ""),
      value: String(item.value ?? ""),
      note: String(item.note ?? ""),
    })),
    platforms: children.platforms.sort((a, b) => Number(a.sort_order) - Number(b.sort_order)).map((item) => ({
      name: String(item.name ?? ""),
      enabled: Boolean(item.enabled),
      posts: String(item.posts ?? "0"),
      views: String(item.views ?? "0"),
      engagements: String(item.engagements ?? "0"),
      er: String(item.er ?? "0%"),
      cpm: String(item.cpm ?? "$0"),
    })),
    uploads: children.uploads.sort((a, b) => Number(a.sort_order) - Number(b.sort_order)).map((item) => ({
      title: String(item.title ?? ""),
      platform: String(item.platform ?? ""),
      url: String(item.url ?? ""),
      views: String(item.views ?? "0"),
      likes: String(item.likes ?? "0"),
      comments: String(item.comments ?? "0"),
      shares: String(item.shares ?? "0"),
      saves: String(item.saves ?? "0"),
      reposts: String(item.reposts ?? "0"),
    })),
    content: children.content.sort((a, b) => Number(a.sort_order) - Number(b.sort_order)).map((item) => ({
      title: String(item.title ?? ""),
      format: String(item.format ?? ""),
      platform: String(item.platform ?? ""),
      mediaUrl: String(item.media_url ?? ""),
      mediaType: item.media_type === "video" ? "video" : "image",
      aspect: ["4 / 5", "9 / 16", "1 / 1", "16 / 9"].includes(String(item.aspect)) ? String(item.aspect) as ContentItem["aspect"] : "4 / 5",
    })),
    organic: children.organic.sort((a, b) => Number(a.sort_order) - Number(b.sort_order)).map((item) => ({
      title: String(item.title ?? ""),
      type: String(item.type ?? ""),
      url: String(item.url ?? ""),
    })),
    recommendations: String(row.recommendations ?? ""),
    methodology: String(row.methodology ?? ""),
    updatedAt: String(row.updated_at ?? ""),
  };
}

async function loadChildren(recapId: string) {
  const filter = `recap_id=eq.${recapId}&order=sort_order.asc`;
  const [metrics, platforms, uploads, content, organic] = await Promise.all([
    supabase(`recap_metrics?${filter}`),
    supabase(`recap_platforms?${filter}`),
    supabase(`recap_uploads?${filter}`),
    supabase(`recap_content_items?${filter}`),
    supabase(`recap_organic_items?${filter}`),
  ]);

  return {
    metrics: metrics as Record<string, unknown>[],
    platforms: platforms as Record<string, unknown>[],
    uploads: uploads as Record<string, unknown>[],
    content: content as Record<string, unknown>[],
    organic: organic as Record<string, unknown>[],
  };
}

async function loadRecaps(slug?: string) {
  const selector = slug
    ? `recaps?slug=eq.${encodeURIComponent(slug)}&limit=1`
    : "recaps?order=updated_at.desc";
  const rows = await supabase(selector) as Record<string, unknown>[];
  const recaps = await Promise.all(rows.map(async (row) => toRecap(row, await loadChildren(String(row.id)))));
  return recaps;
}

async function replaceChildren(recapId: string, recap: Recap) {
  await Promise.all([
    supabase(`recap_metrics?recap_id=eq.${recapId}`, { method: "DELETE" }),
    supabase(`recap_platforms?recap_id=eq.${recapId}`, { method: "DELETE" }),
    supabase(`recap_uploads?recap_id=eq.${recapId}`, { method: "DELETE" }),
    supabase(`recap_content_items?recap_id=eq.${recapId}`, { method: "DELETE" }),
    supabase(`recap_organic_items?recap_id=eq.${recapId}`, { method: "DELETE" }),
  ]);

  const metrics = [
    ...recap.metrics.map((item, index) => ({ recap_id: recapId, metric_group: "hero", sort_order: index, ...item })),
    ...recap.pink58.map((item, index) => ({ recap_id: recapId, metric_group: "pink58", sort_order: index, ...item })),
  ];
  const platforms = recap.platforms.map((item, index) => ({ recap_id: recapId, sort_order: index, ...item }));
  const uploads = recap.uploads.map((item, index) => ({ recap_id: recapId, sort_order: index, ...item }));
  const content = recap.content.map((item, index) => ({
    recap_id: recapId,
    sort_order: index,
    title: item.title,
    format: item.format,
    platform: item.platform,
    media_url: item.mediaUrl,
    media_type: item.mediaType,
    aspect: item.aspect,
  }));
  const organic = recap.organic.map((item, index) => ({ recap_id: recapId, sort_order: index, ...item }));

  await Promise.all([
    metrics.length ? supabase("recap_metrics", { method: "POST", headers: headers("return=minimal"), body: JSON.stringify(metrics) }) : null,
    platforms.length ? supabase("recap_platforms", { method: "POST", headers: headers("return=minimal"), body: JSON.stringify(platforms) }) : null,
    uploads.length ? supabase("recap_uploads", { method: "POST", headers: headers("return=minimal"), body: JSON.stringify(uploads) }) : null,
    content.length ? supabase("recap_content_items", { method: "POST", headers: headers("return=minimal"), body: JSON.stringify(content) }) : null,
    organic.length ? supabase("recap_organic_items", { method: "POST", headers: headers("return=minimal"), body: JSON.stringify(organic) }) : null,
  ]);
}

export async function GET(request: Request) {
  if (!configured()) return Response.json({ configured: false, recaps: [] });

  try {
    const slug = new URL(request.url).searchParams.get("slug") ?? undefined;
    return Response.json({ configured: true, recaps: await loadRecaps(slug) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load recaps";
    return Response.json({ configured: true, error: message, recaps: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!configured()) return Response.json({ configured: false, error: "Supabase is not configured" }, { status: 503 });

  try {
    const { recap } = await request.json() as { recap: Recap };
    const [row] = await supabase("recaps?on_conflict=slug", {
      method: "POST",
      headers: headers("resolution=merge-duplicates,return=representation"),
      body: JSON.stringify(baseRow(recap)),
    }) as Record<string, unknown>[];

    await replaceChildren(String(row.id), recap);
    const [saved] = await loadRecaps(String(row.slug));
    return Response.json({ configured: true, recap: saved });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save recap";
    return Response.json({ configured: true, error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!configured()) return Response.json({ configured: false, error: "Supabase is not configured" }, { status: 503 });

  try {
    const params = new URL(request.url).searchParams;
    const id = params.get("id");
    const slug = params.get("slug");
    const filter = id ? `id=eq.${id}` : `slug=eq.${encodeURIComponent(slug ?? "")}`;
    await supabase(`recaps?${filter}`, { method: "DELETE" });
    return Response.json({ configured: true, ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to delete recap";
    return Response.json({ configured: true, error: message }, { status: 500 });
  }
}
