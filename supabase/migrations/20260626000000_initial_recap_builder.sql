create extension if not exists "pgcrypto";

create table if not exists public.recaps (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  client text not null default '',
  campaign text not null default '',
  period text not null default '',
  objective text not null default '',
  headline text not null default '',
  client_logo_url text not null default '',
  client_logo_name text not null default '',
  insight_drive_url text not null default '',
  content_drive_url text not null default '',
  pink58_url text not null default '',
  pink58_password text not null default '',
  include_pink58 boolean not null default false,
  include_organic boolean not null default true,
  include_recommendations boolean not null default true,
  recommendations text not null default '',
  methodology text not null default '',
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.recap_metrics (
  id uuid primary key default gen_random_uuid(),
  recap_id uuid not null references public.recaps(id) on delete cascade,
  metric_group text not null default 'hero',
  sort_order integer not null default 0,
  label text not null default '',
  value text not null default '',
  note text not null default ''
);

create table if not exists public.recap_platforms (
  id uuid primary key default gen_random_uuid(),
  recap_id uuid not null references public.recaps(id) on delete cascade,
  sort_order integer not null default 0,
  name text not null default '',
  enabled boolean not null default true,
  posts text not null default '0',
  views text not null default '0',
  engagements text not null default '0',
  er text not null default '0%',
  cpm text not null default '$0'
);

create table if not exists public.recap_uploads (
  id uuid primary key default gen_random_uuid(),
  recap_id uuid not null references public.recaps(id) on delete cascade,
  sort_order integer not null default 0,
  title text not null default '',
  platform text not null default '',
  url text not null default '',
  views text not null default '0',
  likes text not null default '0',
  comments text not null default '0',
  shares text not null default '0',
  saves text not null default '0',
  reposts text not null default '0'
);

create table if not exists public.recap_content_items (
  id uuid primary key default gen_random_uuid(),
  recap_id uuid not null references public.recaps(id) on delete cascade,
  sort_order integer not null default 0,
  title text not null default '',
  format text not null default '',
  platform text not null default '',
  media_url text not null default '',
  media_type text not null default 'image' check (media_type in ('image', 'video')),
  aspect text not null default '4 / 5' check (aspect in ('4 / 5', '9 / 16', '1 / 1', '16 / 9'))
);

create table if not exists public.recap_organic_items (
  id uuid primary key default gen_random_uuid(),
  recap_id uuid not null references public.recaps(id) on delete cascade,
  sort_order integer not null default 0,
  title text not null default '',
  type text not null default '',
  url text not null default ''
);

create index if not exists recaps_slug_idx on public.recaps(slug);
create index if not exists recap_metrics_recap_sort_idx on public.recap_metrics(recap_id, metric_group, sort_order);
create index if not exists recap_platforms_recap_sort_idx on public.recap_platforms(recap_id, sort_order);
create index if not exists recap_uploads_recap_sort_idx on public.recap_uploads(recap_id, sort_order);
create index if not exists recap_content_items_recap_sort_idx on public.recap_content_items(recap_id, sort_order);
create index if not exists recap_organic_items_recap_sort_idx on public.recap_organic_items(recap_id, sort_order);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as 'begin
  new.updated_at = now();
  return new;
end;';

drop trigger if exists recaps_set_updated_at on public.recaps;
create trigger recaps_set_updated_at
before update on public.recaps
for each row
execute function public.set_updated_at();

alter table public.recaps enable row level security;
alter table public.recap_metrics enable row level security;
alter table public.recap_platforms enable row level security;
alter table public.recap_uploads enable row level security;
alter table public.recap_content_items enable row level security;
alter table public.recap_organic_items enable row level security;

drop policy if exists "Public can read published recaps" on public.recaps;
create policy "Public can read published recaps"
on public.recaps
for select
using (published = true);

drop policy if exists "Public can read published recap metrics" on public.recap_metrics;
create policy "Public can read published recap metrics"
on public.recap_metrics
for select
using (exists (select 1 from public.recaps where recaps.id = recap_metrics.recap_id and recaps.published = true));

drop policy if exists "Public can read published recap platforms" on public.recap_platforms;
create policy "Public can read published recap platforms"
on public.recap_platforms
for select
using (exists (select 1 from public.recaps where recaps.id = recap_platforms.recap_id and recaps.published = true));

drop policy if exists "Public can read published recap uploads" on public.recap_uploads;
create policy "Public can read published recap uploads"
on public.recap_uploads
for select
using (exists (select 1 from public.recaps where recaps.id = recap_uploads.recap_id and recaps.published = true));

drop policy if exists "Public can read published recap content" on public.recap_content_items;
create policy "Public can read published recap content"
on public.recap_content_items
for select
using (exists (select 1 from public.recaps where recaps.id = recap_content_items.recap_id and recaps.published = true));

drop policy if exists "Public can read published recap organic" on public.recap_organic_items;
create policy "Public can read published recap organic"
on public.recap_organic_items
for select
using (exists (select 1 from public.recaps where recaps.id = recap_organic_items.recap_id and recaps.published = true));

insert into storage.buckets (id, name, public)
values ('recap-media', 'recap-media', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public can view recap media" on storage.objects;
create policy "Public can view recap media"
on storage.objects
for select
using (bucket_id = 'recap-media');
