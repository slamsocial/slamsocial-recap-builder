"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Metric = { label: string; value: string; note: string };
type Platform = {
  name: string;
  enabled: boolean;
  posts: string;
  views: string;
  engagements: string;
  er: string;
  cpm: string;
};
type Upload = {
  title: string;
  platform: string;
  url: string;
  views: string;
  likes: string;
  comments: string;
  shares: string;
  saves: string;
  reposts: string;
};
type ContentMedia = {
  url: string;
  type: "image" | "video";
  name: string;
};
type ContentItem = {
  title: string;
  format: string;
  platform: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  mediaItems?: ContentMedia[];
  aspect: "4 / 5" | "9 / 16" | "1 / 1" | "16 / 9";
};
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

const recapsKey = "slamsocial-recaps-v4";
const sessionKey = "slamsocial-recap-session";
const tabs = ["Setup", "Metrics", "Platforms", "Posts", "Content", "Modules"];
const loginPassword = "Admin1";
const fallbackAppUrl = "https://recaps.slamsocial.biz";

const platformCatalog = [
  { key: "tiktok", label: "TikTok", mark: "♪", className: "tiktok" },
  { key: "instagram", label: "Instagram", mark: "◎", className: "instagram" },
  { key: "reels", label: "Reels", mark: "▶", className: "reels" },
  { key: "youtube", label: "YouTube", mark: "▶", className: "youtube" },
  { key: "facebook", label: "Facebook", mark: "f", className: "facebook" },
  { key: "twitter", label: "X", mark: "X", className: "x" },
  { key: "x", label: "X", mark: "X", className: "x" },
  { key: "linkedin", label: "LinkedIn", mark: "in", className: "linkedin" },
  { key: "pinterest", label: "Pinterest", mark: "P", className: "pinterest" },
  { key: "snapchat", label: "Snapchat", mark: "S", className: "snapchat" },
  { key: "twitch", label: "Twitch", mark: "T", className: "twitch" },
  { key: "discord", label: "Discord", mark: "D", className: "discord" },
];

const sampleRecap: Recap = {
  id: "minions",
  slug: "minions",
  client: "Universal Pictures",
  campaign: "Minions launch campaign recap",
  period: "Launch week through final creator post",
  objective:
    "Drive opening-week awareness through creator-led short-form content, social conversation, and entertainment culture pickup.",
  headline:
    "A bright, share-heavy creator campaign that beat forecast on views and delivered efficient CPM across short-form channels.",
  clientLogoUrl: "",
  clientLogoName: "",
  insightDriveUrl: "https://drive.google.com/",
  contentDriveUrl: "https://drive.google.com/",
  pink58Url: "https://pink58.com/",
  pink58Password: "client-password-here",
  includePink58: true,
  includeOrganic: true,
  includeRecommendations: true,
  metrics: [
    { label: "Total views", value: "8.42M", note: "+18% vs forecast" },
    { label: "Engagements", value: "512.8K", note: "6.09% engagement rate" },
    { label: "CPM", value: "$4.82", note: "Target: below $6.00" },
    { label: "Uploads live", value: "47", note: "31 creator deliverables" },
  ],
  platforms: [
    { name: "TikTok", enabled: true, posts: "24", views: "5.8M", engagements: "348K", er: "6.0%", cpm: "$4.31" },
    { name: "Instagram", enabled: true, posts: "18", views: "2.1M", engagements: "141K", er: "6.7%", cpm: "$5.18" },
    { name: "X", enabled: true, posts: "5", views: "520K", engagements: "23.8K", er: "4.6%", cpm: "$6.05" },
  ],
  uploads: [
    { title: "Creator launch wave", platform: "TikTok", url: "https://www.tiktok.com/@creator/video/launch-wave", views: "1.24M", likes: "94K", comments: "4.8K", shares: "11K", saves: "7.2K", reposts: "2.1K" },
    { title: "Behind the scenes carousel", platform: "Instagram", url: "https://www.instagram.com/p/behind-the-scenes", views: "684K", likes: "42K", comments: "2.4K", shares: "5.1K", saves: "8.8K", reposts: "1.3K" },
    { title: "Reaction clip thread", platform: "X", url: "https://x.com/slamsocial/status/reaction-thread", views: "212K", likes: "12K", comments: "810", shares: "2.2K", saves: "430", reposts: "3.4K" },
  ],
  content: [
    { title: "Launch meme edit", format: "9:16 short-form", platform: "TikTok + Reels", mediaUrl: "", mediaType: "image", aspect: "9 / 16" },
    { title: "Creator stitch prompt", format: "Reaction format", platform: "TikTok", mediaUrl: "", mediaType: "image", aspect: "9 / 16" },
    { title: "Giveaway carousel", format: "Static carousel", platform: "Instagram", mediaUrl: "", mediaType: "image", aspect: "4 / 5" },
    { title: "Opening weekend thread", format: "Text + clip", platform: "X", mediaUrl: "", mediaType: "image", aspect: "16 / 9" },
  ],
  organic: [
    { title: "Entertainment blog roundup", type: "News article", url: "https://example.com/entertainment-roundup" },
    { title: "Fan account compilation", type: "Organic social post", url: "https://www.instagram.com/p/fan-compilation" },
    { title: "Cinema culture newsletter mention", type: "Newsletter", url: "https://example.com/newsletter/cinema-culture" },
  ],
  pink58: [
    { label: "Posts tracked", value: "126", note: "Creator + earned clips" },
    { label: "Views", value: "10.7M", note: "Pink58 tracked total" },
    { label: "Likes", value: "642K", note: "Topline social likes" },
    { label: "Comments", value: "41K", note: "Comment volume" },
    { label: "Shares", value: "54K", note: "Share actions" },
    { label: "Engagement rate", value: "6.8%", note: "Across tracked posts" },
  ],
  recommendations:
    "Keep the creator remix format. Brief for more save-worthy carousel assets. Reserve paid amplification for posts with early share velocity.",
  methodology:
    "Metrics should be collected from platform insights, creator screenshots, Google Drive evidence, and Pink58 where relevant. Add the collection date before sending externally.",
  updatedAt: new Date().toISOString(),
};

function makeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function loadRecaps() {
  if (typeof window === "undefined") return [sampleRecap];
  const saved = window.localStorage.getItem(recapsKey);
  if (!saved) return [sampleRecap];
  try {
    const parsed = JSON.parse(saved) as Recap[];
    return parsed.length ? parsed : [sampleRecap];
  } catch {
    return [sampleRecap];
  }
}

function saveRecaps(recaps: Recap[]) {
  window.localStorage.setItem(recapsKey, JSON.stringify(recaps));
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function preloadClientAssets() {
  const imagePaths = ["/images/slamsocial-logo.png", "/images/campaign-content-collage.png"];
  const imageLoads = imagePaths.map((src) => new Promise<void>((resolve) => {
    const image = new Image();
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = src;
  }));
  const fontReady = "fonts" in document ? document.fonts.ready.then(() => undefined).catch(() => undefined) : Promise.resolve();
  await Promise.allSettled([...imageLoads, fontReady]);
}

async function fetchRemoteRecaps(slug?: string) {
  const path = slug ? `/api/recaps?slug=${encodeURIComponent(slug)}` : "/api/recaps";
  const response = await fetch(path);
  if (!response.ok) throw new Error("Unable to load Supabase recaps");
  return response.json() as Promise<{ configured: boolean; recaps: Recap[] }>;
}

async function saveRemoteRecap(recap: Recap) {
  const response = await fetch("/api/recaps", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ recap }),
  });
  if (!response.ok) throw new Error("Unable to save Supabase recap");
  return response.json() as Promise<{ configured: boolean; recap?: Recap }>;
}

async function deleteRemoteRecap(recap: Recap) {
  const response = await fetch(`/api/recaps?id=${encodeURIComponent(recap.id)}&slug=${encodeURIComponent(recap.slug)}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Unable to delete Supabase recap");
}

function updateAt<T>(rows: T[], index: number, patch: Partial<T>) {
  return rows.map((row, rowIndex) => rowIndex === index ? { ...row, ...patch } : row);
}

function removeAt<T>(rows: T[], index: number) {
  return rows.filter((_, rowIndex) => rowIndex !== index);
}

function getContentMedia(item: ContentItem): ContentMedia[] {
  if (item.mediaItems?.length) return item.mediaItems.slice(0, 12);
  if (item.mediaUrl) return [{ url: item.mediaUrl, type: item.mediaType, name: item.title }];
  return [];
}

function Stat({ label, value }: { label: string; value: string }) {
  return <span className="mobile-stat" data-label={label}>{value}</span>;
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {multiline ? (
        <textarea value={value} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <button className={`toggle ${checked ? "is-on" : ""}`} onClick={onChange} type="button">
      <span>{label}</span>
      <i aria-hidden="true" />
    </button>
  );
}

function getPlatformMarks(platform: string) {
  const normalized = platform.toLowerCase();
  const matches = platformCatalog.filter((item) => {
    if (item.key === "x") return normalized === "x" || /\bx\b/.test(normalized);
    return normalized.includes(item.key);
  });

  if (matches.length) {
    return matches.filter((item, index, list) => list.findIndex((match) => match.className === item.className) === index);
  }

  return [{ key: "fallback", label: platform, mark: platform.trim().charAt(0).toUpperCase() || "•", className: "fallback" }];
}

function PlatformBadge({ platform, compact = false }: { platform: string; compact?: boolean }) {
  const marks = getPlatformMarks(platform);

  return (
    <span className={`platform-badge ${compact ? "is-compact" : ""}`}>
      <span className="platform-logo-stack" aria-hidden="true">
        {marks.slice(0, 3).map((item) => (
          <span className={`platform-logo logo-${item.className}`} key={`${item.key}-${item.label}`}>{item.mark}</span>
        ))}
      </span>
      <span className="platform-label">{platform}</span>
    </span>
  );
}

function AnimatedMetricValue({ value }: { value: string }) {
  const match = useMemo(() => value.match(/^([^0-9-]*)(-?\d+(?:\.\d+)?)(.*)$/), [value]);
  const [displayValue, setDisplayValue] = useState(value);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!match) return;

    const [, prefix, rawNumber, suffix] = match;
    const target = Number(rawNumber);
    const decimals = rawNumber.includes(".") ? rawNumber.split(".")[1].length : 0;
    const start = performance.now();
    const duration = 1150;

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(`${prefix}${(target * eased).toFixed(decimals)}${suffix}`);
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
    }

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [match]);

  return <>{match ? displayValue : value}</>;
}

function FileField({ label, accept, onLoad }: { label: string; accept: string; onLoad: (dataUrl: string, fileName: string, fileType: string) => void }) {
  return (
    <label className="file-field">
      <span>{label}</span>
      <input
        accept={accept}
        type="file"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => onLoad(String(reader.result), file.name, file.type);
          reader.readAsDataURL(file);
        }}
      />
    </label>
  );
}

function MultiFileField({
  label,
  accept,
  maxFiles = 12,
  onLoad,
}: {
  label: string;
  accept: string;
  maxFiles?: number;
  onLoad: (files: ContentMedia[]) => void;
}) {
  return (
    <label className="file-field">
      <span>{label}</span>
      <input
        accept={accept}
        multiple
        type="file"
        onChange={(event) => {
          const files = Array.from(event.target.files ?? []).slice(0, maxFiles);
          if (!files.length) return;
          Promise.all(files.map((file) => new Promise<ContentMedia>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve({
              url: String(reader.result),
              type: file.type.startsWith("video") ? "video" : "image",
              name: file.name,
            });
            reader.readAsDataURL(file);
          }))).then(onLoad);
        }}
      />
    </label>
  );
}

function LoadingScreen({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="slam-loader">
      <div className="slam-ambient-loader" />
      <div className="loader-card">
        <div className="slam-ring">
          <img alt="SlamSocial" src="/images/slamsocial-logo.png" />
        </div>
        <div className="slam-bar" />
      </div>
    </div>
  );
}

function ContentMediaCarousel({ item, mediaItems }: { item: ContentItem; mediaItems: ContentMedia[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  function scrollToSlide(index: number) {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollTo({ left: scroller.clientWidth * index, behavior: "smooth" });
    setActiveIndex(index);
  }

  return (
    <>
      <div
        className="media-carousel"
        ref={scrollerRef}
        aria-label={`${item.title} media`}
        onScroll={(event) => {
          const scroller = event.currentTarget;
          const nextIndex = Math.round(scroller.scrollLeft / Math.max(scroller.clientWidth, 1));
          setActiveIndex(Math.min(Math.max(nextIndex, 0), mediaItems.length - 1));
        }}
      >
        {mediaItems.map((media, mediaIndex) => (
          <div className="media-slide" key={`${media.name}-${mediaIndex}`}>
            {media.type === "video" ? <video src={media.url} muted playsInline preload="metadata" controls /> : <img alt={media.name || item.title} src={media.url} />}
          </div>
        ))}
      </div>
      {mediaItems.length > 1 ? (
        <div className="carousel-controls" aria-label={`${item.title} carousel position`}>
          <span>{activeIndex + 1}/{mediaItems.length}</span>
          <div>
            {mediaItems.map((media, mediaIndex) => (
              <button
                aria-label={`View asset ${mediaIndex + 1}`}
                className={mediaIndex === activeIndex ? "is-active" : ""}
                key={`${media.name}-${mediaIndex}-dot`}
                onClick={() => scrollToSlide(mediaIndex)}
                type="button"
              />
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}

export default function RecapApp({ initialMode = "dashboard", initialSlug }: { initialMode?: "dashboard" | "client"; initialSlug?: string }) {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginValue, setLoginValue] = useState("");
  const [loginError, setLoginError] = useState("");
  const [recaps, setRecaps] = useState<Recap[]>([sampleRecap]);
  const [activeId, setActiveId] = useState(sampleRecap.id);
  const [view, setView] = useState<"dashboard" | "builder" | "client">(initialMode === "client" ? "client" : "dashboard");
  const [activeTab, setActiveTab] = useState("Setup");
  const [editorHidden, setEditorHidden] = useState(initialMode === "client");
  const [copied, setCopied] = useState(false);
  const [remoteEnabled, setRemoteEnabled] = useState(false);
  const [remoteReady, setRemoteReady] = useState(false);
  const [saveStatus, setSaveStatus] = useState("Device draft");
  const [publishOpen, setPublishOpen] = useState(false);
  const [publishCopied, setPublishCopied] = useState(false);
  const saveTimerRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      const loaded = loadRecaps();
      if (cancelled) return;
      setRecaps(loaded);
      const bySlug = initialSlug ? loaded.find((recap) => recap.slug === initialSlug) : null;
      setActiveId(bySlug?.id ?? loaded[0]?.id ?? sampleRecap.id);
      setLoggedIn(initialMode === "client" || window.sessionStorage.getItem(sessionKey) === "yes");

      const remoteLoad = fetchRemoteRecaps(initialSlug)
        .then((payload) => {
          if (cancelled) return;
          setRemoteEnabled(payload.configured);
          if (payload.configured && payload.recaps.length) {
            setRecaps(payload.recaps);
            setActiveId(payload.recaps[0].id);
            setSaveStatus("Synced to Supabase");
          } else if (payload.configured) {
            setSaveStatus("Ready to sync");
          }
        })
        .catch(() => {
          if (cancelled) return;
          setRemoteEnabled(false);
          setSaveStatus("Device draft");
        })
        .finally(() => {
          if (!cancelled) setRemoteReady(true);
        });

      await Promise.allSettled([
        Promise.race([remoteLoad, wait(initialMode === "client" ? 5200 : 3600)]),
        preloadClientAssets(),
        wait(initialMode === "client" ? 1800 : 1200),
      ]);
      if (!cancelled) setLoading(false);
    }

    boot();
    return () => {
      cancelled = true;
    };
  }, [initialMode, initialSlug]);

  useEffect(() => {
    if (typeof window !== "undefined") saveRecaps(recaps);
  }, [recaps]);

  const activeRecap = recaps.find((recap) => recap.id === activeId) ?? recaps[0] ?? sampleRecap;
  const activePlatforms = useMemo(() => activeRecap.platforms.filter((platform) => platform.enabled), [activeRecap.platforms]);
  const previewUrl = `/p/${activeRecap.slug || "untitled"}`;
  const publishUrl = `${typeof window !== "undefined" ? window.location.origin : fallbackAppUrl}${previewUrl}`;

  useEffect(() => {
    if (!remoteEnabled || !remoteReady || view === "client") return;
    if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    saveTimerRef.current = window.setTimeout(() => {
      setSaveStatus("Saving...");
      saveRemoteRecap(activeRecap)
        .then((payload) => {
          if (payload.recap && payload.recap.id !== activeRecap.id) {
            setRecaps((current) => current.map((recap) => recap.id === activeRecap.id ? payload.recap as Recap : recap));
            setActiveId(payload.recap.id);
          }
          setSaveStatus(payload.configured ? "Synced to Supabase" : "Device draft");
        })
        .catch(() => setSaveStatus("Sync failed"));
    }, 700);

    return () => {
      if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    };
  }, [activeRecap, remoteEnabled, remoteReady, view]);

  function patchRecap(patch: Partial<Recap>) {
    setRecaps((current) =>
      current.map((recap) =>
        recap.id === activeRecap.id ? { ...recap, ...patch, updatedAt: new Date().toISOString() } : recap,
      ),
    );
  }

  function createRecap() {
    const id = makeId();
    const next: Recap = {
      ...sampleRecap,
      id,
      slug: slugify(`campaign-${recaps.length + 1}`),
      client: "New client",
      campaign: "New campaign recap",
      clientLogoUrl: "",
      clientLogoName: "",
      updatedAt: new Date().toISOString(),
    };
    setRecaps((current) => [next, ...current]);
    setActiveId(id);
    setView("builder");
    setEditorHidden(false);
  }

  function duplicateRecap(recap: Recap) {
    const id = makeId();
    const next = {
      ...recap,
      id,
      slug: slugify(`${recap.slug}-copy`),
      campaign: `${recap.campaign} copy`,
      updatedAt: new Date().toISOString(),
    };
    setRecaps((current) => [next, ...current]);
    setActiveId(id);
    setView("builder");
  }

  function deleteRecap(id: string) {
    const deleted = recaps.find((recap) => recap.id === id);
    if (deleted && remoteEnabled) {
      deleteRemoteRecap(deleted).catch(() => setSaveStatus("Delete sync failed"));
    }
    const remaining = recaps.filter((recap) => recap.id !== id);
    const next = remaining.length ? remaining : [sampleRecap];
    setRecaps(next);
    setActiveId(next[0].id);
  }

  function login() {
    if (loginValue.trim() !== loginPassword) {
      setLoginError("Use the workspace password.");
      return;
    }
    window.sessionStorage.setItem(sessionKey, "yes");
    setLoggedIn(true);
  }

  async function copyJson() {
    await navigator.clipboard.writeText(JSON.stringify(activeRecap, null, 2));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  async function publishRecap() {
    if (remoteEnabled && view !== "client") {
      setSaveStatus("Publishing...");
      try {
        const payload = await saveRemoteRecap(activeRecap);
        setSaveStatus(payload.configured ? "Published" : "Device draft");
      } catch {
        setSaveStatus("Publish sync failed");
      }
    }
    setPublishOpen(true);
    try {
      await navigator.clipboard.writeText(publishUrl);
      setPublishCopied(true);
      window.setTimeout(() => setPublishCopied(false), 1800);
    } catch {
      setPublishCopied(false);
    }
  }

  if (!loggedIn) {
    return (
      <main className="builder-shell gate-shell">
        <LoadingScreen active={loading} />
        <div className="login-card">
          <img alt="SlamSocial" src="/images/slamsocial-logo.png" />
          <p>Private workspace</p>
          <h1>Campaign recap dashboard</h1>
          <form onSubmit={(event) => { event.preventDefault(); login(); }}>
            <input autoFocus placeholder="Workspace password" type="password" value={loginValue} onChange={(event) => setLoginValue(event.target.value)} />
            {loginError ? <span>{loginError}</span> : null}
            <button type="submit">Enter dashboard</button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className={`builder-shell ${editorHidden ? "is-client-framed" : ""}`}>
      <LoadingScreen active={loading} />
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="topbar">
        <button className="brand brand-button" type="button" onClick={() => setView("dashboard")}>
          <img alt="SlamSocial" src="/images/slamsocial-logo.png" />
          <span>Campaign Recaps</span>
        </button>
        {view !== "client" ? (
          <div className="top-actions">
            <button type="button" onClick={createRecap}>New recap</button>
            <button type="button" onClick={() => setView("dashboard")}>Dashboard</button>
            <button type="button" onClick={() => setEditorHidden((value) => !value)}>
              {editorHidden ? "Show control deck" : "Hide control deck"}
            </button>
            <a className="button-link" href={previewUrl} target="_blank">Preview client</a>
            <button type="button" onClick={publishRecap}>{publishCopied ? "Link copied" : "Publish"}</button>
            <button type="button" onClick={copyJson}>{copied ? "Copied JSON" : "Copy JSON"}</button>
            <button type="button" onClick={() => window.print()}>Print / PDF</button>
            <span className={`sync-pill ${remoteEnabled ? "is-live" : ""}`}>{saveStatus}</span>
          </div>
        ) : null}
      </header>

      {publishOpen && view !== "client" ? (
        <div className="publish-panel" role="dialog" aria-label="Published client link">
          <div>
            <p className="mini-label">Published link</p>
            <input readOnly value={publishUrl} onFocus={(event) => event.currentTarget.select()} />
          </div>
          <button type="button" onClick={publishRecap}>{publishCopied ? "Copied" : "Copy link"}</button>
          <button className="publish-close" type="button" onClick={() => setPublishOpen(false)}>Close</button>
        </div>
      ) : null}

      {view === "dashboard" ? (
        <section className="dashboard">
          <div className="dashboard-hero">
            <h1>Create new recap</h1>
            <button type="button" onClick={createRecap}>Create new recap</button>
          </div>
          <div className="recap-list">
            {recaps.map((recap) => (
              <article className="recap-row" key={recap.id}>
                <div>
                  <p>{recap.client}</p>
                  <h2>{recap.campaign}</h2>
                  <span>{`/p/${recap.slug}`}</span>
                </div>
                <div className="row-actions">
                  <button type="button" onClick={() => { setActiveId(recap.id); setView("builder"); setEditorHidden(false); }}>Edit</button>
                  <a href={`/p/${recap.slug}`} target="_blank">Preview</a>
                  <button type="button" onClick={() => duplicateRecap(recap)}>Duplicate</button>
                  <button type="button" onClick={() => deleteRecap(recap.id)}>Delete</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : (
        <div className="workspace" id="top">
          {!editorHidden ? (
            <Editor
              activeRecap={activeRecap}
              activeTab={activeTab}
              patchRecap={patchRecap}
              setActiveTab={setActiveTab}
            />
          ) : null}
          <RecapCanvas
            activePlatforms={activePlatforms}
            report={activeRecap}
            clientMode={editorHidden || view === "client"}
          />
        </div>
      )}
    </main>
  );
}

function Editor({
  activeRecap,
  activeTab,
  patchRecap,
  setActiveTab,
}: {
  activeRecap: Recap;
  activeTab: string;
  patchRecap: (patch: Partial<Recap>) => void;
  setActiveTab: (tab: string) => void;
}) {
  return (
    <aside className="editor-panel" aria-label="Recap editor">
      <div className="editor-heading">
        <p>Control deck</p>
        <h1>Build the recap.</h1>
        <span className="slug-preview">{`/p/${activeRecap.slug}`}</span>
      </div>
      <div className="tabs">
        {tabs.map((tab) => (
          <button className={activeTab === tab ? "active" : ""} key={tab} onClick={() => setActiveTab(tab)} type="button">
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Setup" ? (
        <div className="editor-stack">
          <Field label="Client" value={activeRecap.client} onChange={(client) => patchRecap({ client })} />
          <Field label="Campaign" value={activeRecap.campaign} onChange={(campaign) => patchRecap({ campaign })} />
          <Field label="URL slug" value={activeRecap.slug} onChange={(slug) => patchRecap({ slug: slugify(slug) })} />
          <FileField
            accept="image/*"
            label="Client logo"
            onLoad={(clientLogoUrl, clientLogoName) => patchRecap({ clientLogoUrl, clientLogoName })}
          />
          {activeRecap.clientLogoName ? <p className="upload-note">{activeRecap.clientLogoName}</p> : null}
          <Field label="Reporting period" value={activeRecap.period} onChange={(period) => patchRecap({ period })} />
          <Field label="Campaign objective" value={activeRecap.objective} multiline onChange={(objective) => patchRecap({ objective })} />
          <Field label="Executive headline" value={activeRecap.headline} multiline onChange={(headline) => patchRecap({ headline })} />
          <Field label="Google Drive insights URL" value={activeRecap.insightDriveUrl} onChange={(insightDriveUrl) => patchRecap({ insightDriveUrl })} />
          <Field label="Google Drive content URL" value={activeRecap.contentDriveUrl} onChange={(contentDriveUrl) => patchRecap({ contentDriveUrl })} />
        </div>
      ) : null}

      {activeTab === "Metrics" ? (
        <div className="editor-stack">
          {activeRecap.metrics.map((metric, index) => (
            <div className="row-editor" key={`${metric.label}-${index}`}>
              <button className="remove" onClick={() => patchRecap({ metrics: removeAt(activeRecap.metrics, index) })} type="button">Remove</button>
              <Field label="Label" value={metric.label} onChange={(label) => patchRecap({ metrics: updateAt(activeRecap.metrics, index, { label }) })} />
              <Field label="Value" value={metric.value} onChange={(value) => patchRecap({ metrics: updateAt(activeRecap.metrics, index, { value }) })} />
              <Field label="Note" value={metric.note} onChange={(note) => patchRecap({ metrics: updateAt(activeRecap.metrics, index, { note }) })} />
            </div>
          ))}
          <button className="add" onClick={() => patchRecap({ metrics: [...activeRecap.metrics, { label: "New metric", value: "0", note: "Add context" }] })} type="button">Add metric</button>
        </div>
      ) : null}

      {activeTab === "Platforms" ? (
        <div className="editor-stack">
          {activeRecap.platforms.map((platform, index) => (
            <div className="row-editor" key={`${platform.name}-${index}`}>
              <div className="split">
                <PlatformBadge compact platform={platform.name} />
                <Toggle checked={platform.enabled} label="Show" onChange={() => patchRecap({ platforms: updateAt(activeRecap.platforms, index, { enabled: !platform.enabled }) })} />
                <button className="remove" onClick={() => patchRecap({ platforms: removeAt(activeRecap.platforms, index) })} type="button">Remove</button>
              </div>
              {(["name", "posts", "views", "engagements", "er", "cpm"] as const).map((field) => (
                <Field key={field} label={field.toUpperCase()} value={String(platform[field])} onChange={(value) => patchRecap({ platforms: updateAt(activeRecap.platforms, index, { [field]: value }) })} />
              ))}
            </div>
          ))}
          <button className="add" onClick={() => patchRecap({ platforms: [...activeRecap.platforms, { name: "New platform", enabled: true, posts: "0", views: "0", engagements: "0", er: "0%", cpm: "$0" }] })} type="button">Add platform</button>
        </div>
      ) : null}

      {activeTab === "Posts" ? (
        <div className="editor-stack">
          {activeRecap.uploads.map((upload, index) => (
            <div className="row-editor" key={`${upload.title}-${index}`}>
              <button className="remove" onClick={() => patchRecap({ uploads: removeAt(activeRecap.uploads, index) })} type="button">Remove</button>
              {(["title", "platform", "url", "views", "likes", "comments", "shares", "saves", "reposts"] as const).map((field) => (
                <Field key={field} label={field} value={upload[field]} onChange={(value) => patchRecap({ uploads: updateAt(activeRecap.uploads, index, { [field]: value }) })} />
              ))}
            </div>
          ))}
          <button className="add" onClick={() => patchRecap({ uploads: [...activeRecap.uploads, { title: "New upload", platform: "Platform", url: "https://", views: "0", likes: "0", comments: "0", shares: "0", saves: "0", reposts: "0" }] })} type="button">Add post link</button>
        </div>
      ) : null}

      {activeTab === "Content" ? (
        <div className="editor-stack">
          {activeRecap.content.map((item, index) => (
            <div className="row-editor" key={`${item.title}-${index}`}>
              <button className="remove" onClick={() => patchRecap({ content: removeAt(activeRecap.content, index) })} type="button">Remove</button>
              <MultiFileField
                accept="image/*,video/*"
                label="Images or videos, up to 12"
                onLoad={(newMediaItems) => {
                  const mediaItems = [...getContentMedia(item), ...newMediaItems].slice(0, 12);
                  patchRecap({
                    content: updateAt(activeRecap.content, index, {
                      mediaItems,
                      mediaUrl: mediaItems[0]?.url ?? "",
                      mediaType: mediaItems[0]?.type ?? "image",
                    }),
                  });
                }}
              />
              {getContentMedia(item).length ? (
                <div className="media-file-summary">
                  <span>{getContentMedia(item).length} file{getContentMedia(item).length === 1 ? "" : "s"} in tile</span>
                  <button
                    className="remove"
                    onClick={() => patchRecap({ content: updateAt(activeRecap.content, index, { mediaItems: [], mediaUrl: "", mediaType: "image" }) })}
                    type="button"
                  >
                    Clear media
                  </button>
                </div>
              ) : null}
              {(["title", "format", "platform"] as const).map((field) => (
                <Field key={field} label={field} value={item[field]} onChange={(value) => patchRecap({ content: updateAt(activeRecap.content, index, { [field]: value }) })} />
              ))}
              <label className="field">
                <span>Tile size</span>
                <select value={item.aspect} onChange={(event) => patchRecap({ content: updateAt(activeRecap.content, index, { aspect: event.target.value as ContentItem["aspect"] }) })}>
                  <option value="4 / 5">4:5</option>
                  <option value="9 / 16">9:16</option>
                  <option value="1 / 1">1:1</option>
                  <option value="16 / 9">16:9</option>
                </select>
              </label>
            </div>
          ))}
          <button className="add" onClick={() => patchRecap({ content: [...activeRecap.content, { title: "New content piece", format: "Format", platform: "Platform", mediaUrl: "", mediaType: "image", mediaItems: [], aspect: "4 / 5" }] })} type="button">Add content tile</button>
        </div>
      ) : null}

      {activeTab === "Modules" ? (
        <div className="editor-stack">
          <Toggle checked={activeRecap.includePink58} label="Show Pink58 recap" onChange={() => patchRecap({ includePink58: !activeRecap.includePink58 })} />
          <Toggle checked={activeRecap.includeOrganic} label="Show organic activity" onChange={() => patchRecap({ includeOrganic: !activeRecap.includeOrganic })} />
          <Toggle checked={activeRecap.includeRecommendations} label="Show recommendations" onChange={() => patchRecap({ includeRecommendations: !activeRecap.includeRecommendations })} />
          <Field label="Pink58 recap URL" value={activeRecap.pink58Url} onChange={(pink58Url) => patchRecap({ pink58Url })} />
          <Field label="Pink58 password" value={activeRecap.pink58Password} onChange={(pink58Password) => patchRecap({ pink58Password })} />
          <Field label="Recommendations" value={activeRecap.recommendations} multiline onChange={(recommendations) => patchRecap({ recommendations })} />
          <Field label="Methodology note" value={activeRecap.methodology} multiline onChange={(methodology) => patchRecap({ methodology })} />
        </div>
      ) : null}
    </aside>
  );
}

function RecapCanvas({ report, activePlatforms, clientMode }: { report: Recap; activePlatforms: Platform[]; clientMode: boolean }) {
  const [postIndexOpen, setPostIndexOpen] = useState(false);
  const [channelsOpen, setChannelsOpen] = useState(false);
  const [contentOpen, setContentOpen] = useState(false);
  const [pink58Open, setPink58Open] = useState(false);

  return (
    <section className={`recap-canvas ${clientMode ? "client-canvas" : ""}`} aria-label="Live campaign recap">
      <section className="hero-block reveal-card">
        <div className="hero-copy">
          <p className="eyebrow">{report.client}</p>
          <h2>{report.campaign}</h2>
          <p className="hero-lede">{report.headline}</p>
          <div className="slam-rule" />
          <p className="period">{report.period}</p>
        </div>
        <div className="hero-mark">
          <div className="logo-lockup">
            <div className="orbit"><img alt="SlamSocial" src="/images/slamsocial-logo.png" /></div>
            {report.clientLogoUrl ? (
              <div className="client-logo-card">
                <span>Client</span>
                <img alt={`${report.client} logo`} src={report.clientLogoUrl} />
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="report-section objective-section reveal-card">
        <p className="section-kicker">Objective</p>
        <p>{report.objective}</p>
      </section>

      <section className="metric-grid reveal-card">
        {report.metrics.map((metric) => (
          <article className="metric-card" key={metric.label}>
            <p>{metric.label}</p>
            <strong><AnimatedMetricValue value={metric.value} /></strong>
            <span>{metric.note}</span>
          </article>
        ))}
      </section>

      <section className={`report-section reveal-card mobile-collapse ${channelsOpen ? "is-open" : ""}`}>
        <div className="section-head">
          <div><p className="section-kicker">Platform split</p><h3>Results by channel</h3></div>
          <span>{activePlatforms.length} active channels</span>
        </div>
        <button className="mobile-collapse-trigger" type="button" onClick={() => setChannelsOpen((open) => !open)}>
          <i aria-hidden="true" />{channelsOpen ? "Hide" : "View"} results by channel
        </button>
        <div className="mobile-collapse-panel">
          <div className="platform-table">
            <div className="platform-row table-head"><span>Platform</span><span>Posts</span><span>Views</span><span>Engagements</span><span>ER</span><span>CPM</span></div>
            {activePlatforms.map((platform) => (
              <div className="platform-row" key={platform.name}>
                <strong><PlatformBadge platform={platform.name} /></strong>
                <Stat label="Posts" value={platform.posts} />
                <Stat label="Views" value={platform.views} />
                <Stat label="Engagements" value={platform.engagements} />
                <Stat label="ER" value={platform.er} />
                <Stat label="CPM" value={platform.cpm} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="report-section reveal-card">
        <div className={`post-details ${postIndexOpen ? "is-open" : ""}`}>
          <button className="post-summary" type="button" onClick={() => setPostIndexOpen((open) => !open)}>
            <span><p className="section-kicker">Uploads</p><h3>Live post index</h3></span>
            <span className="expand-pill"><i aria-hidden="true" />{postIndexOpen ? "Hide" : "View"} {report.uploads.length} links</span>
          </button>
          <div className="post-panel">
            <div className="post-panel-inner">
              <div className="post-toolbar">
                <a href={report.insightDriveUrl}>Insights Drive</a>
                <a href={report.contentDriveUrl}>Content Drive</a>
              </div>
              <div className="post-index-table">
                <div className="post-index-row table-head">
                  <span>Post</span><span>Platform</span><span>Views</span><span>Likes</span><span>Comments</span><span>Shares</span><span>Saves</span><span>Reposts</span>
                </div>
                {report.uploads.map((upload) => (
                  <a className="post-index-row" href={upload.url} key={`${upload.title}-${upload.url}`}>
                    <strong>{upload.title}</strong>
                    <span className="mobile-stat" data-label="Platform"><PlatformBadge compact platform={upload.platform} /></span>
                    <Stat label="Views" value={upload.views} />
                    <Stat label="Likes" value={upload.likes} />
                    <Stat label="Comments" value={upload.comments} />
                    <Stat label="Shares" value={upload.shares} />
                    <Stat label="Saves" value={upload.saves} />
                    <Stat label="Reposts" value={upload.reposts} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`report-section reveal-card mobile-collapse ${contentOpen ? "is-open" : ""}`}>
        <div className="section-head">
          <div><p className="section-kicker">Creative</p><h3>Content used</h3></div>
          <a href={report.contentDriveUrl}>Content Drive</a>
        </div>
        <button className="mobile-collapse-trigger" type="button" onClick={() => setContentOpen((open) => !open)}>
          <i aria-hidden="true" />{contentOpen ? "Hide" : "View"} content used
        </button>
        <div className="mobile-collapse-panel">
          <div className="content-grid">
            {report.content.map((item, index) => {
              const mediaItems = getContentMedia(item);

              return (
                <article className="content-card" key={`${item.title}-${index}`}>
                  <div className={`thumb media-thumb ${mediaItems.length > 1 ? "is-carousel" : ""}`} style={{ aspectRatio: item.aspect }}>
                    {mediaItems.length ? (
                      <ContentMediaCarousel item={item} mediaItems={mediaItems} />
                    ) : <span>{String(index + 1).padStart(2, "0")}</span>}
                  </div>
                  {mediaItems.length > 1 ? <span className="carousel-count">{mediaItems.length} assets, swipe to view</span> : null}
                  <strong>{item.title}</strong>
                  <p>{item.format}</p>
                  <small><PlatformBadge compact platform={item.platform} /></small>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {report.includePink58 ? (
        <section className={`report-section pink-section reveal-card mobile-collapse ${pink58Open ? "is-open" : ""}`}>
          <div className="section-head">
            <div><p className="section-kicker">Pink58 clipping</p><h3>Topline tracking recap</h3></div>
            <a className="report-cta" href={report.pink58Url}><span>Full Pink58 report</span><i aria-hidden="true" /></a>
          </div>
          <button className="mobile-collapse-trigger" type="button" onClick={() => setPink58Open((open) => !open)}>
            <i aria-hidden="true" />{pink58Open ? "Hide" : "View"} Pink58 topline recap
          </button>
          <div className="mobile-collapse-panel">
            <div className="mobile-collapse-inner">
              <div className="password-note"><span>Password</span><strong>{report.pink58Password}</strong></div>
              <div className="pink-grid">
                {report.pink58.map((metric) => <article key={metric.label}><span>{metric.label}</span><strong>{metric.value}</strong><p>{metric.note}</p></article>)}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {report.includeOrganic ? (
        <section className="report-section reveal-card">
          <div className="section-head"><div><p className="section-kicker">Organic lift</p><h3>Earned activity off the back of the campaign</h3></div></div>
          <div className="organic-list">
            {report.organic.map((item) => <a href={item.url} key={`${item.title}-${item.url}`}><span>{item.type}</span><strong>{item.title}</strong></a>)}
          </div>
        </section>
      ) : null}

      {report.includeRecommendations ? (
        <section className="report-section recommendation-section reveal-card">
          <div><p className="section-kicker">What next</p><h3>Recommendations</h3></div>
          <p>{report.recommendations}</p>
        </section>
      ) : null}

      <section className="methodology reveal-card"><p>{report.methodology}</p></section>
    </section>
  );
}
