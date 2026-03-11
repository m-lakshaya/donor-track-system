-- Add notification tracking and appointment columns
alter table donation_requests add column if not exists notified_at timestamp with time zone;
alter table donation_requests add column if not exists donation_date text;
alter table donation_requests add column if not exists donation_time text;
alter table donation_requests add column if not exists donation_location text;

-- Update status constraint to include new states
-- First, drop the old constraint if it exists (names can vary, we try common ones or just redefine)
alter table donation_requests drop constraint if exists donation_requests_status_check;

alter table donation_requests add constraint donation_requests_status_check 
check (status in ('pending', 'approved', 'notified', 'accepted', 'fulfilled', 'rejected', 'cancelled'));

-- Ensure RLS allows these updates
-- (Admin/Hospital can already update anything, but let's be explicit)
drop policy if exists "Hospitals can manage their notifications" on donation_requests;
create policy "Hospitals can manage their notifications" on donation_requests
for update
using (
  exists (
    select 1 from profiles 
    where id = auth.uid() and role in ('hospital', 'admin')
  )
);
