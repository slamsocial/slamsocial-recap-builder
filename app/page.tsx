"use client";

import { useEffect, useMemo, useState } from "react";

type Metric = {
  label: string;
  value: string;
  note: string;
};

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
  result: string;
};

type ContentItem = {
  title: string;
  format: string;
  platform: string;
  result: string;
};

type OrganicItem = {
  title: string;
  type: string;
  url: string;
};

type ReportData = {
  client: string;
  campaign: string;
  period: string;
  objective: string;
  headline: string;
  insightDriveUrl: string;
  contentDriveUrl: string;
  pink58Url: string;
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
};

const sampleReport: ReportData = {
  client: "Universal Pictures",
  campaign: "Minions launch campaign recap",
  period: "Launch week through final creator post",
  objective:
    "Drive opening-week awareness through creator-led short-form content, social conversation, and entertainment culture pickup.",
  headline:
    "A bright, share-heavy creator campaign that beat forecast on views and delivered efficient CPM across short-form channels.",
  insightDriveUrl: "https://drive.google.com/",
  contentDriveUrl: "https://drive.google.com/",
  pink58Url: "https://pink58.com/",
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
    {
      name: "TikTok",
      enabled: true,
      posts: "24",
      views: "5.8M",
      engagements: "348K",
      er: "6.0%",
      cpm: "$4.31",
    },
    {
      name: "Instagram",
      enabled: true,
      posts: "18",
      views: "2.1M",
      engagements: "141K",
      er: "6.7%",
      cpm: "$5.18",
    },
    {
      name: "X",
      enabled: true,
      posts: "5",
      views: "520K",
      engagements: "23.8K",
      er: "4.6%",
      cpm: "$6.05",
    },
  ],
  uploads: [
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
  ],
  content: [
    {
      title: "Launch meme edit",
      format: "9:16 short-form",
      platform: "TikTok + Reels",
      result: "2.3M views",
    },
    {
      title: "Creator stitch prompt",
      format: "Reaction format",
      platform: "TikTok",
      result: "118K shares",
    },
    {
      title: "Giveaway carousel",
      format: "Static carousel",
      platform: "Instagram",
      result: "14.2K saves",
    },
    {
      title: "Opening weekend thread",
      format: "Text + clip",
      platform: "X",
      result: "4.9% ER",
    },
  ],
  organic: [
    {
      title: "Entertainment blog roundup",
      type: "News article",
      url: "https://example.com/entertainment-roundup",
    },
    {
      title: "Fan account compilation",
      type: "Organic social post",
      url: "https://www.instagram.com/p/fan-compilation",
    },
    {
      title: "Cinema culture newsletter mention",
      type: "Newsletter",
      url: "https://example.com/newsletter/cinema-culture",
    },
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
    "Keep the creator remix format, brief for more save-worthy carousel assets, and reserve paid amplification for posts with early share velocity.",
  methodology:
    "Metrics should be collected from platform insights, creator screenshots, Google Drive evidence, and Pink58 where relevant. Add the collection date before sending externally.",
};

const tabs = ["Setup", "Metrics", "Platforms", "Links", "Content", "Modules"];
const storageKey = "slamsocial-recap-builder-v2";

function updateAt<T>(rows: T[], index: number, patch: Partial<T>) {
  return rows.map((row, rowIndex) =>
    rowIndex === index ? { ...row, ...patch } : row,
  );
}

function removeAt<T>(rows: T[], index: number) {
  return rows.filter((_, rowIndex) => rowIndex !== index);
}

function TextInput({
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

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      className={`toggle ${checked ? "is-on" : ""}`}
      onClick={onChange}
      type="button"
    >
      <span>{label}</span>
      <i aria-hidden="true" />
    </button>
  );
}

export default function Home() {
  const [report, setReport] = useState(sampleReport);
  const [activeTab, setActiveTab] = useState("Setup");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return;
    try {
      setReport({ ...sampleReport, ...JSON.parse(saved) });
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(report));
  }, [report]);

  const activePlatforms = useMemo(
    () => report.platforms.filter((platform) => platform.enabled),
    [report.platforms],
  );

  function patchReport(patch: Partial<ReportData>) {
    setReport((current) => ({ ...current, ...patch }));
  }

  async function copyJson() {
    await navigator.clipboard.writeText(JSON.stringify(report, null, 2));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <main className="builder-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="topbar">
        <a className="brand" href="#top">
          <img alt="SlamSocial" src="/images/slamsocial-logo.png" />
          <span>Recap Builder</span>
        </a>
        <div className="top-actions">
          <button type="button" onClick={copyJson}>
            {copied ? "Copied JSON" : "Copy JSON"}
          </button>
          <button type="button" onClick={() => window.print()}>
            Print / PDF
          </button>
          <button type="button" onClick={() => setReport(sampleReport)}>
            Load Sample
          </button>
        </div>
      </header>

      <div className="workspace" id="top">
        <aside className="editor-panel" aria-label="Recap editor">
          <div className="editor-heading">
            <p>Control deck</p>
            <h1>Build the report, then send the canvas.</h1>
          </div>

          <div className="tabs">
            {tabs.map((tab) => (
              <button
                className={activeTab === tab ? "active" : ""}
                key={tab}
                onClick={() => setActiveTab(tab)}
                type="button"
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "Setup" ? (
            <div className="editor-stack">
              <TextInput
                label="Client"
                value={report.client}
                onChange={(client) => patchReport({ client })}
              />
              <TextInput
                label="Campaign"
                value={report.campaign}
                onChange={(campaign) => patchReport({ campaign })}
              />
              <TextInput
                label="Reporting period"
                value={report.period}
                onChange={(period) => patchReport({ period })}
              />
              <TextInput
                label="Campaign objective"
                value={report.objective}
                multiline
                onChange={(objective) => patchReport({ objective })}
              />
              <TextInput
                label="Executive headline"
                value={report.headline}
                multiline
                onChange={(headline) => patchReport({ headline })}
              />
              <TextInput
                label="Google Drive insights URL"
                value={report.insightDriveUrl}
                onChange={(insightDriveUrl) => patchReport({ insightDriveUrl })}
              />
              <TextInput
                label="Google Drive content URL"
                value={report.contentDriveUrl}
                onChange={(contentDriveUrl) => patchReport({ contentDriveUrl })}
              />
            </div>
          ) : null}

          {activeTab === "Metrics" ? (
            <div className="editor-stack">
              {report.metrics.map((metric, index) => (
                <div className="row-editor" key={`${metric.label}-${index}`}>
                  <button
                    className="remove"
                    onClick={() =>
                      patchReport({
                        metrics: removeAt(report.metrics, index),
                      })
                    }
                    type="button"
                  >
                    Remove
                  </button>
                  <TextInput
                    label="Label"
                    value={metric.label}
                    onChange={(label) =>
                      patchReport({
                        metrics: updateAt(report.metrics, index, { label }),
                      })
                    }
                  />
                  <TextInput
                    label="Value"
                    value={metric.value}
                    onChange={(value) =>
                      patchReport({
                        metrics: updateAt(report.metrics, index, { value }),
                      })
                    }
                  />
                  <TextInput
                    label="Note"
                    value={metric.note}
                    onChange={(note) =>
                      patchReport({
                        metrics: updateAt(report.metrics, index, { note }),
                      })
                    }
                  />
                </div>
              ))}
              <button
                className="add"
                onClick={() =>
                  patchReport({
                    metrics: [
                      ...report.metrics,
                      { label: "New metric", value: "0", note: "Add context" },
                    ],
                  })
                }
                type="button"
              >
                Add metric
              </button>
            </div>
          ) : null}

          {activeTab === "Platforms" ? (
            <div className="editor-stack">
              {report.platforms.map((platform, index) => (
                <div className="row-editor" key={`${platform.name}-${index}`}>
                  <div className="split">
                    <Toggle
                      checked={platform.enabled}
                      label="Show"
                      onChange={() =>
                        patchReport({
                          platforms: updateAt(report.platforms, index, {
                            enabled: !platform.enabled,
                          }),
                        })
                      }
                    />
                    <button
                      className="remove"
                      onClick={() =>
                        patchReport({
                          platforms: removeAt(report.platforms, index),
                        })
                      }
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                  {(["name", "posts", "views", "engagements", "er", "cpm"] as const).map(
                    (field) => (
                      <TextInput
                        key={field}
                        label={field.toUpperCase()}
                        value={String(platform[field])}
                        onChange={(value) =>
                          patchReport({
                            platforms: updateAt(report.platforms, index, {
                              [field]: value,
                            }),
                          })
                        }
                      />
                    ),
                  )}
                </div>
              ))}
              <button
                className="add"
                onClick={() =>
                  patchReport({
                    platforms: [
                      ...report.platforms,
                      {
                        name: "New platform",
                        enabled: true,
                        posts: "0",
                        views: "0",
                        engagements: "0",
                        er: "0%",
                        cpm: "$0",
                      },
                    ],
                  })
                }
                type="button"
              >
                Add platform
              </button>
            </div>
          ) : null}

          {activeTab === "Links" ? (
            <div className="editor-stack">
              {report.uploads.map((upload, index) => (
                <div className="row-editor" key={`${upload.title}-${index}`}>
                  <button
                    className="remove"
                    onClick={() =>
                      patchReport({ uploads: removeAt(report.uploads, index) })
                    }
                    type="button"
                  >
                    Remove
                  </button>
                  {(["title", "platform", "url", "result"] as const).map((field) => (
                    <TextInput
                      key={field}
                      label={field}
                      value={upload[field]}
                      onChange={(value) =>
                        patchReport({
                          uploads: updateAt(report.uploads, index, {
                            [field]: value,
                          }),
                        })
                      }
                    />
                  ))}
                </div>
              ))}
              <button
                className="add"
                onClick={() =>
                  patchReport({
                    uploads: [
                      ...report.uploads,
                      {
                        title: "New upload",
                        platform: "Platform",
                        url: "https://",
                        result: "Result",
                      },
                    ],
                  })
                }
                type="button"
              >
                Add upload link
              </button>
            </div>
          ) : null}

          {activeTab === "Content" ? (
            <div className="editor-stack">
              {report.content.map((item, index) => (
                <div className="row-editor" key={`${item.title}-${index}`}>
                  <button
                    className="remove"
                    onClick={() =>
                      patchReport({ content: removeAt(report.content, index) })
                    }
                    type="button"
                  >
                    Remove
                  </button>
                  {(["title", "format", "platform", "result"] as const).map((field) => (
                    <TextInput
                      key={field}
                      label={field}
                      value={item[field]}
                      onChange={(value) =>
                        patchReport({
                          content: updateAt(report.content, index, {
                            [field]: value,
                          }),
                        })
                      }
                    />
                  ))}
                </div>
              ))}
              <button
                className="add"
                onClick={() =>
                  patchReport({
                    content: [
                      ...report.content,
                      {
                        title: "New content piece",
                        format: "Format",
                        platform: "Platform",
                        result: "Result",
                      },
                    ],
                  })
                }
                type="button"
              >
                Add content piece
              </button>
            </div>
          ) : null}

          {activeTab === "Modules" ? (
            <div className="editor-stack">
              <Toggle
                checked={report.includePink58}
                label="Show Pink58 recap"
                onChange={() =>
                  patchReport({ includePink58: !report.includePink58 })
                }
              />
              <Toggle
                checked={report.includeOrganic}
                label="Show organic activity"
                onChange={() =>
                  patchReport({ includeOrganic: !report.includeOrganic })
                }
              />
              <Toggle
                checked={report.includeRecommendations}
                label="Show recommendations"
                onChange={() =>
                  patchReport({
                    includeRecommendations: !report.includeRecommendations,
                  })
                }
              />
              <TextInput
                label="Pink58 recap URL"
                value={report.pink58Url}
                onChange={(pink58Url) => patchReport({ pink58Url })}
              />
              <TextInput
                label="Recommendations"
                value={report.recommendations}
                multiline
                onChange={(recommendations) => patchReport({ recommendations })}
              />
              <TextInput
                label="Methodology note"
                value={report.methodology}
                multiline
                onChange={(methodology) => patchReport({ methodology })}
              />
              <div className="row-editor">
                <p className="mini-label">Organic activity</p>
                {report.organic.map((item, index) => (
                  <div className="nested" key={`${item.title}-${index}`}>
                    <button
                      className="remove"
                      onClick={() =>
                        patchReport({
                          organic: removeAt(report.organic, index),
                        })
                      }
                      type="button"
                    >
                      Remove
                    </button>
                    {(["title", "type", "url"] as const).map((field) => (
                      <TextInput
                        key={field}
                        label={field}
                        value={item[field]}
                        onChange={(value) =>
                          patchReport({
                            organic: updateAt(report.organic, index, {
                              [field]: value,
                            }),
                          })
                        }
                      />
                    ))}
                  </div>
                ))}
                <button
                  className="add"
                  onClick={() =>
                    patchReport({
                      organic: [
                        ...report.organic,
                        { title: "New pickup", type: "Type", url: "https://" },
                      ],
                    })
                  }
                  type="button"
                >
                  Add organic pickup
                </button>
              </div>
            </div>
          ) : null}
        </aside>

        <section className="recap-canvas" aria-label="Live campaign recap">
          <section className="hero-block">
            <div className="hero-copy">
              <p className="eyebrow">{report.client}</p>
              <h2>
                {report.campaign} <span>case study</span>
              </h2>
              <p className="hero-lede">{report.headline}</p>
              <div className="slam-rule" />
              <p className="period">{report.period}</p>
            </div>
            <div className="hero-mark">
              <div className="orbit">
                <img alt="SlamSocial" src="/images/slamsocial-logo.png" />
              </div>
            </div>
          </section>

          <section className="report-section objective-section">
            <p className="section-kicker">Objective</p>
            <p>{report.objective}</p>
          </section>

          <section className="metric-grid">
            {report.metrics.map((metric) => (
              <article className="metric-card" key={metric.label}>
                <p>{metric.label}</p>
                <strong>{metric.value}</strong>
                <span>{metric.note}</span>
              </article>
            ))}
          </section>

          <section className="report-section">
            <div className="section-head">
              <div>
                <p className="section-kicker">Platform split</p>
                <h3>Results by channel</h3>
              </div>
              <span>{activePlatforms.length} active channels</span>
            </div>
            <div className="platform-table">
              <div className="platform-row table-head">
                <span>Platform</span>
                <span>Posts</span>
                <span>Views</span>
                <span>Engagements</span>
                <span>ER</span>
                <span>CPM</span>
              </div>
              {activePlatforms.map((platform) => (
                <div className="platform-row" key={platform.name}>
                  <strong>{platform.name}</strong>
                  <span>{platform.posts}</span>
                  <span>{platform.views}</span>
                  <span>{platform.engagements}</span>
                  <span>{platform.er}</span>
                  <span>{platform.cpm}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="report-split">
            <div className="report-section">
              <div className="section-head">
                <div>
                  <p className="section-kicker">Uploads</p>
                  <h3>Live post index</h3>
                </div>
                <a href={report.insightDriveUrl}>Insights Drive</a>
              </div>
              <div className="link-list">
                {report.uploads.map((upload) => (
                  <a href={upload.url} key={`${upload.title}-${upload.url}`}>
                    <span>
                      <strong>{upload.title}</strong>
                      <em>{upload.platform}</em>
                    </span>
                    <b>{upload.result}</b>
                  </a>
                ))}
              </div>
            </div>

            <div className="report-section">
              <div className="section-head">
                <div>
                  <p className="section-kicker">Creative</p>
                  <h3>Content used</h3>
                </div>
                <a href={report.contentDriveUrl}>Content Drive</a>
              </div>
              <div className="content-grid">
                {report.content.map((item, index) => (
                  <article className="content-card" key={`${item.title}-${index}`}>
                    <div className="thumb">
                      <span>{String(index + 1).padStart(2, "0")}</span>
                    </div>
                    <strong>{item.title}</strong>
                    <p>{item.format}</p>
                    <small>
                      {item.platform} / {item.result}
                    </small>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {report.includePink58 ? (
            <section className="report-section pink-section">
              <div className="section-head">
                <div>
                  <p className="section-kicker">Pink58 clipping</p>
                  <h3>Topline tracking recap</h3>
                </div>
                <a href={report.pink58Url}>Full Pink58 report</a>
              </div>
              <div className="pink-grid">
                {report.pink58.map((metric) => (
                  <article key={metric.label}>
                    <span>{metric.label}</span>
                    <strong>{metric.value}</strong>
                    <p>{metric.note}</p>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {report.includeOrganic ? (
            <section className="report-section">
              <div className="section-head">
                <div>
                  <p className="section-kicker">Organic lift</p>
                  <h3>Earned activity off the back of the campaign</h3>
                </div>
              </div>
              <div className="organic-list">
                {report.organic.map((item) => (
                  <a href={item.url} key={`${item.title}-${item.url}`}>
                    <span>{item.type}</span>
                    <strong>{item.title}</strong>
                  </a>
                ))}
              </div>
            </section>
          ) : null}

          {report.includeRecommendations ? (
            <section className="report-section recommendation-section">
              <div>
                <p className="section-kicker">What next</p>
                <h3>Recommendations</h3>
              </div>
              <p>{report.recommendations}</p>
            </section>
          ) : null}

          <section className="methodology">
            <p>{report.methodology}</p>
          </section>
        </section>
      </div>
    </main>
  );
}
