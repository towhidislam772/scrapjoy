-- Scrapjoy — lock down customer photos (run in Supabase SQL Editor)
--
-- Makes the photo bucket PRIVATE: customers can still upload, but nobody can
-- read the originals via a public URL anymore. Only the admin dashboard can view
-- them, using short-lived signed URLs generated server-side with the service key.
--
-- ⚠️ Run this AFTER schema.sql. It's safe to run on an existing bucket.

-- 1) Make the bucket private
update storage.buckets set public = false where id = 'order-photos';

-- 2) Remove the public read policy (no more public access to originals)
drop policy if exists "public read order photos" on storage.objects;

-- 3) Keep uploads working (customers can still send photos)
drop policy if exists "anon upload order photos" on storage.objects;
create policy "anon upload order photos"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'order-photos');

-- (Reading is now done only via signed URLs from the admin API, which uses the
--  service-role key and bypasses these policies. So no public/anon SELECT policy
--  is created — that's the whole point.)
