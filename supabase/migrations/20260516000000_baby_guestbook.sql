create table public.baby_guestbook (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.baby_guestbook enable row level security;

create policy "Allow public inserts" on public.baby_guestbook
  for insert with check (true);
