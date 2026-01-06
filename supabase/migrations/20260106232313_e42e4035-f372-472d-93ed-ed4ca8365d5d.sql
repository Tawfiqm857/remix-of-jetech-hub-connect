-- 1) Public bucket for gadget/product images
insert into storage.buckets (id, name, public)
values ('gadget-images', 'gadget-images', true)
on conflict (id) do update set public = excluded.public;

-- 2) Storage RLS policies (create only if missing)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Public read gadget images'
  ) then
    create policy "Public read gadget images"
    on storage.objects
    for select
    using (bucket_id = 'gadget-images');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Admins upload gadget images'
  ) then
    create policy "Admins upload gadget images"
    on storage.objects
    for insert
    with check (bucket_id = 'gadget-images' and public.has_role(auth.uid(), 'admin'));
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Admins update gadget images'
  ) then
    create policy "Admins update gadget images"
    on storage.objects
    for update
    using (bucket_id = 'gadget-images' and public.has_role(auth.uid(), 'admin'));
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Admins delete gadget images'
  ) then
    create policy "Admins delete gadget images"
    on storage.objects
    for delete
    using (bucket_id = 'gadget-images' and public.has_role(auth.uid(), 'admin'));
  end if;
end $$;

-- 3) Enable realtime events for admin notifications (safe if already added)
do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='orders') then
    alter publication supabase_realtime add table public.orders;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='service_requests') then
    alter publication supabase_realtime add table public.service_requests;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='enrollments') then
    alter publication supabase_realtime add table public.enrollments;
  end if;
end $$;