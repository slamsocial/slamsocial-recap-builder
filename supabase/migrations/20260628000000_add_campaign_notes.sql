alter table public.recaps
  add column if not exists campaign_notes text not null default '';
