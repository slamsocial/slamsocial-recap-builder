alter table public.recap_organic_items
  add column if not exists body_text text not null default '',
  add column if not exists media_url text not null default '',
  add column if not exists media_type text not null default 'image',
  add column if not exists media_name text not null default '',
  add column if not exists aspect text not null default '4 / 5';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'recap_organic_items_media_type_check'
      and conrelid = 'public.recap_organic_items'::regclass
  ) then
    alter table public.recap_organic_items
      add constraint recap_organic_items_media_type_check
      check (media_type in ('image', 'video'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'recap_organic_items_aspect_check'
      and conrelid = 'public.recap_organic_items'::regclass
  ) then
    alter table public.recap_organic_items
      add constraint recap_organic_items_aspect_check
      check (aspect in ('4 / 5', '9 / 16', '1 / 1', '16 / 9'));
  end if;
end $$;
