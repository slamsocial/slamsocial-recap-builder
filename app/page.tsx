"use client";

import { useMemo, useState } from "react";

const defaultPlatforms = [
  {
    name: "TikTok",
    enabled: true,
    posts: 24,
    views: "5.8M",
    engagements: "348K",
    er: "6.0%",
    cpm: "$4.31",
    accent: "bg-cyan-500",
  },
  {
    name: "Instagram",
    enabled: true,
    posts: 18,
    views: "2.1M",
    engagements: "141K",
    er: "6.7%",
    cpm: "$5.18",
    accent: "bg-rose-500",
  },
  {
    name: "X",
    enabled: true,
    posts: 5,
    views: "520K",
    engagements: "23.8K",
    er: "4.6%",
    cpm: "$6.05",
    accent: "bg-zinc-900",
  },
];

const requiredModules = [
  "Upload links",
  "CPM and spend efficiency",
  "Total views",
  "Engagement totals",
  "Likes, comments, shares, reposts, saves",
  "Engagement rate",
  "Content gallery",
  "Platform splits",
  "Google Drive insights",
  "Google Drive content collection",
];

const optionalModules = [
  "Pink58 clipping recap",
  "Organic pickup and earned activity",
  "Top performing posts",
  "Campaign learnings",
  "Next campaign recommendations",
];

const engagementRows = [
  ["Likes", "412,450", "80.4%"],
  ["Comments", "28,940", "5.6%"],
  ["Shares", "31,780", "6.2%"],
  ["Saves", "19,420", "3.8%"],
  ["Reposts", "20,210", "4.0%"],
];

const uploadLinks = [
  {
    title: "Creator launch wave",
    platform: "TikTok",
    url: "https://www.tiktok.com/@creator/video/launch-wave",
    result: "1.24M views",
  },
  {
    title: "Behind the scenes carousel",
    platform: "Instagram",
    url: "https://www.instagram.com/p/behind-the-scenes",
    result: "684K views",
  },
  {
    title: "Reaction clip thread",
    platform: "X",
    url: "https://x.com/slamsocial/status/reaction-thread",
    result: "212K views",
  },
];

const contentPieces = [
  ["Launch meme edit", "9:16 short-form", "2.3M views", "bg-amber-300"],
  ["Creator stitch prompt", "Reaction format", "118K shares", "bg-cyan-200"],
  ["Giveaway carousel", "Static carousel", "14.2K saves", "bg-rose-200"],
  ["Opening weekend thread", "Text + clip", "4.9% ER", "bg-emerald-200"],
];

const pink58Stats = [
  ["Posts tracked", "126"],
  ["Views", "10.7M"],
  ["Likes", "642K"],
  ["Comments", "41K"],
  ["Shares", "54K"],
  ["Engagement rate", "6.8%"],
  ["CPM", "$3.91"],
];

const organicActivity = [
  ["Entertainment blog roundup", "News article"],
  ["Fan account compilation", "Organic social post"],
  ["Cinema culture newsletter mention", "Newsletter"],
];

const additions = [
  "Campaign objective, KPI target, and result status",
  "Spend, budget pacing, and estimated media value",
  "Flight dates, markets, audience, and targeting notes",
  "Creator roster with handles, deliverables, and approval status",
  "Paid, creator, earned, and organic activity separated clearly",
  "Top posts ranked by views, ER, shares, saves, and comments",
  "Sentiment, comment themes, brand safety, and audience quality",
  "Benchmarks against forecast, prior campaigns, or category norms",
  "Metric definitions, source methodology, and data collection date",
  "Learnings, recommendations, and reuse rights for future content",
];

export default function Home() {
  const [clientName, setClientName] = useState("SlamSocial client");
  const [campaignName, setCampaignName] = useState("Launch campaign recap");
  const [includePink58, setIncludePink58] = useState(true);
  const [includeOrganic, setIncludeOrganic] = useState(true);
  const [platforms, setPlatforms] = useState(defaultPlatforms);

  const activePlatforms = useMemo(
    () => platforms.filter((platform) => platform.enabled),
    [platforms],
  );

  const templateCoverage = includePink58
    ? [...requiredModules, ...optionalModules]
    : [...requiredModules, "Organic pickup and earned activity"];

  function togglePlatform(name: string) {
    setPlatforms((current) =>
      current.map((platform) =>
        platform.name === name
          ? { ...platform, enabled: !platform.enabled }
          : platform,
      ),
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f3ee] text-zinc-950">
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <nav className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase text-zinc-500">
                SlamSocial reporting
              </p>
              <h1 className="mt-2 text-3xl font-semibold sm:text-5xl">
                Campaign recap builder
              </h1>
            </div>
            <div className="flex flex-wrap gap-2 text-sm font-medium">
              <a
                className="rounded-md border border-zinc-300 px-3 py-2 text-zinc-800 transition hover:border-zinc-950"
                href="https://drive.google.com/"
              >
                Insights source
              </a>
              <a
                className="rounded-md bg-zinc-950 px-3 py-2 text-white transition hover:bg-zinc-800"
                href="https://drive.google.com/"
              >
                Content library
              </a>
            </div>
          </nav>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[390px_1fr] lg:px-8">
        <aside className="space-y-5">
          <section className="rounded-lg border border-zinc-200 bg-white p-5">
            <p className="text-sm font-semibold text-zinc-500">
              Template setup
            </p>
            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="text-sm font-medium">Client</span>
                <input
                  className="mt-2 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-zinc-950"
                  value={clientName}
                  onChange={(event) => setClientName(event.target.value)}
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Campaign</span>
                <input
                  className="mt-2 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-zinc-950"
                  value={campaignName}
                  onChange={(event) => setCampaignName(event.target.value)}
                />
              </label>
            </div>
          </section>

          <section className="rounded-lg border border-zinc-200 bg-white p-5">
            <p className="text-sm font-semibold text-zinc-500">
              Platforms used
            </p>
            <div className="mt-4 space-y-2">
              {platforms.map((platform) => (
                <label
                  className="flex items-center justify-between rounded-md border border-zinc-200 px-3 py-2"
                  key={platform.name}
                >
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <span
                      className={`h-3 w-3 rounded-full ${platform.accent}`}
                      aria-hidden="true"
                    />
                    {platform.name}
                  </span>
                  <input
                    checked={platform.enabled}
                    className="h-4 w-4 accent-zinc-950"
                    onChange={() => togglePlatform(platform.name)}
                    type="checkbox"
                  />
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-zinc-200 bg-white p-5">
            <p className="text-sm font-semibold text-zinc-500">
              Conditional modules
            </p>
            <div className="mt-4 space-y-2">
              <label className="flex items-center justify-between rounded-md border border-zinc-200 px-3 py-2">
                <span className="text-sm font-medium">Pink58 recap</span>
                <input
                  checked={includePink58}
                  className="h-4 w-4 accent-zinc-950"
                  onChange={() => setIncludePink58((value) => !value)}
                  type="checkbox"
                />
              </label>
              <label className="flex items-center justify-between rounded-md border border-zinc-200 px-3 py-2">
                <span className="text-sm font-medium">Organic activity</span>
                <input
                  checked={includeOrganic}
                  className="h-4 w-4 accent-zinc-950"
                  onChange={() => setIncludeOrganic((value) => !value)}
                  type="checkbox"
                />
              </label>
            </div>
          </section>

          <section className="rounded-lg border border-zinc-200 bg-[#101820] p-5 text-white">
            <p className="text-sm font-semibold text-cyan-200">
              Template coverage
            </p>
            <p className="mt-2 text-3xl font-semibold">
              {templateCoverage.length} sections
            </p>
            <div className="mt-4 space-y-2 text-sm text-zinc-200">
              {templateCoverage.slice(0, 8).map((item) => (
                <p className="rounded-md bg-white/10 px-3 py-2" key={item}>
                  {item}
                </p>
              ))}
            </div>
          </section>
        </aside>

        <section className="space-y-5">
          <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
            <section className="flex flex-col justify-between rounded-lg border border-zinc-200 bg-[#fffaf0] p-5">
              <div>
                <p className="text-sm font-semibold text-amber-700">
                  Live recap preview
                </p>
                <h2 className="mt-2 text-3xl font-semibold">
                  {campaignName}
                </h2>
                <p className="mt-2 text-lg text-zinc-700">{clientName}</p>
                <p className="mt-5 max-w-2xl leading-7 text-zinc-700">
                  A reusable post-campaign case study shell for summarising
                  outcomes, linking every source asset, separating channel
                  performance, and capturing what the campaign taught the team.
                </p>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  ["Total views", "8.42M", "+18% vs forecast"],
                  ["Engagements", "512.8K", "6.09% ER"],
                  ["CPM", "$4.82", "Target: <$6.00"],
                  ["Uploads live", "47", "31 creator posts"],
                ].map(([label, value, note]) => (
                  <article
                    className="rounded-lg border border-amber-200 bg-white p-4"
                    key={label}
                  >
                    <p className="text-sm text-zinc-500">{label}</p>
                    <p className="mt-2 text-3xl font-semibold">{value}</p>
                    <p className="mt-2 text-sm font-medium text-emerald-700">
                      {note}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
              <img
                alt="Collage of reusable campaign content previews"
                className="h-full min-h-[320px] w-full object-cover"
                src="/images/campaign-content-collage.png"
              />
            </div>
          </div>

          <section className="rounded-lg border border-zinc-200 bg-white p-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-zinc-500">
                  Platform split
                </p>
                <h2 className="mt-1 text-2xl font-semibold">
                  Channel performance modules
                </h2>
              </div>
              <p className="text-sm text-zinc-500">
                {activePlatforms.length} active platform
                {activePlatforms.length === 1 ? "" : "s"}
              </p>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {activePlatforms.map((item) => (
                <article
                  className="rounded-lg border border-zinc-200 p-4"
                  key={item.name}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-3 w-3 rounded-full ${item.accent}`}
                        aria-hidden="true"
                      />
                      <h3 className="font-semibold">{item.name}</h3>
                    </div>
                    <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-semibold">
                      {item.posts} posts
                    </span>
                  </div>
                  <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <dt className="text-zinc-500">Views</dt>
                      <dd className="mt-1 text-xl font-semibold">
                        {item.views}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-zinc-500">Engagements</dt>
                      <dd className="mt-1 text-xl font-semibold">
                        {item.engagements}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-zinc-500">ER</dt>
                      <dd className="mt-1 text-xl font-semibold">{item.er}</dd>
                    </div>
                    <div>
                      <dt className="text-zinc-500">CPM</dt>
                      <dd className="mt-1 text-xl font-semibold">
                        {item.cpm}
                      </dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          </section>

          <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
            <section className="rounded-lg border border-zinc-200 bg-white p-5">
              <h2 className="text-2xl font-semibold">Upload index</h2>
              <div className="mt-5 divide-y divide-zinc-100">
                {uploadLinks.map((upload) => (
                  <a
                    className="flex flex-wrap items-center justify-between gap-3 py-4 transition hover:text-amber-700"
                    href={upload.url}
                    key={upload.title}
                  >
                    <span>
                      <span className="block font-semibold">
                        {upload.title}
                      </span>
                      <span className="mt-1 block text-sm text-zinc-500">
                        {upload.platform}
                      </span>
                    </span>
                    <span className="rounded-md bg-amber-100 px-2 py-1 text-sm font-semibold text-amber-900">
                      {upload.result}
                    </span>
                  </a>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-zinc-200 bg-white p-5">
              <h2 className="text-2xl font-semibold">Engagement mix</h2>
              <div className="mt-5 space-y-3">
                {engagementRows.map(([label, value, share]) => (
                  <div key={label}>
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="font-medium">{label}</span>
                      <span className="text-zinc-500">
                        {value} · {share}
                      </span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-zinc-100">
                      <div
                        className="h-2 rounded-full bg-emerald-500"
                        style={{ width: share }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="rounded-lg border border-zinc-200 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-zinc-500">
                  Creative library
                </p>
                <h2 className="mt-1 text-2xl font-semibold">
                  Content used in the campaign
                </h2>
              </div>
              <a
                className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium transition hover:border-zinc-950"
                href="https://drive.google.com/"
              >
                Drive folder
              </a>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {contentPieces.map(([name, format, stat, color]) => (
                <article
                  className="overflow-hidden rounded-lg border border-zinc-200"
                  key={name}
                >
                  <div className={`flex aspect-[4/5] items-end p-3 ${color}`}>
                    <div className="w-full rounded-md bg-white/85 p-3">
                      <p className="text-sm font-semibold">{name}</p>
                      <p className="mt-1 text-xs text-zinc-600">{format}</p>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-sm text-zinc-500">Template card</p>
                    <p className="mt-2 font-semibold">{stat}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
            {includePink58 ? (
              <section className="rounded-lg border border-zinc-200 bg-[#101820] p-5 text-white">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-cyan-200">
                      Pink58 clipping
                    </p>
                    <h2 className="mt-1 text-2xl font-semibold">
                      Optional topline recap
                    </h2>
                  </div>
                  <a
                    className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-zinc-950"
                    href="https://pink58.com/"
                  >
                    Full report
                  </a>
                </div>
                <dl className="mt-5 grid grid-cols-2 gap-3">
                  {pink58Stats.map(([label, value]) => (
                    <div className="rounded-lg bg-white/10 p-3" key={label}>
                      <dt className="text-xs text-zinc-300">{label}</dt>
                      <dd className="mt-1 text-xl font-semibold">{value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ) : null}

            {includeOrganic ? (
              <section className="rounded-lg border border-zinc-200 bg-white p-5">
                <h2 className="text-2xl font-semibold">Organic pickup</h2>
                <div className="mt-4 space-y-3">
                  {organicActivity.map(([title, type]) => (
                    <a
                      className="block rounded-lg border border-zinc-200 p-3 transition hover:border-amber-500"
                      href="https://example.com"
                      key={title}
                    >
                      <p className="text-xs font-semibold uppercase text-zinc-500">
                        {type}
                      </p>
                      <p className="mt-1 font-semibold">{title}</p>
                    </a>
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          <section className="rounded-lg border border-zinc-200 bg-white p-5">
            <p className="text-sm font-semibold text-zinc-500">
              Add to the base brief
            </p>
            <h2 className="mt-1 text-2xl font-semibold">
              Reporting fields worth including
            </h2>
            <div className="mt-5 grid gap-2 md:grid-cols-2">
              {additions.map((item) => (
                <div
                  className="flex gap-2 rounded-md border border-zinc-200 px-3 py-2 text-sm leading-6"
                  key={item}
                >
                  <span
                    className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-500"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
