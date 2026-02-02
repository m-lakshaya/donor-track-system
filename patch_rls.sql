-- Allow Donors to update the status of requests (to mark them as 'fulfilled'/volunteered)
-- Currently only Admin/Hospital can update. We need to add policy for Donors.

create policy "Donors can fulfill requests" on donation_requests 
for update 
using (
  auth.role() = 'authenticated' 
  and 
  exists (select 1 from profiles where id = auth.uid() and role = 'donor')
);

-- Optional: Add a column to track WHICH donor fulfilled it
alter table donation_requests add column donor_id uuid references profiles(id);
