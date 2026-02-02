-- Important: Add donor_id column to track WHO donated
alter table donation_requests add column donor_id uuid references profiles(id);

-- Ensure donors can update this new column
-- (Re-run the policy just in case, though the previous one covered 'for update' on the whole row)
drop policy if exists "Donors can fulfill requests" on donation_requests;

create policy "Donors can fulfill requests" on donation_requests 
for update 
using (
  auth.role() = 'authenticated' 
);
