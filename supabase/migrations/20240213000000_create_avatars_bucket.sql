
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true);

-- Allow authenticated users to upload their own avatar
create policy "Users can upload their own avatar"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'avatars' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to update their own avatar
create policy "Users can update their own avatar"
on storage.objects for update
to authenticated
using (
  bucket_id = 'avatars' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public access to view avatars
create policy "Anyone can view avatars"
on storage.objects for select
to public
using (bucket_id = 'avatars');
