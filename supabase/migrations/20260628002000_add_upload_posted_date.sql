alter table public.recap_uploads
  add column if not exists posted_date text not null default '';
