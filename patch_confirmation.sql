-- Patch to add confirmation details to donation requests
-- Run this in the Supabase SQL Editor

-- 1. Add new columns for donation appointment details
ALTER TABLE donation_requests 
ADD COLUMN IF NOT EXISTS donation_date DATE,
ADD COLUMN IF NOT EXISTS donation_time TIME,
ADD COLUMN IF NOT EXISTS donation_location TEXT;

-- 2. Update status constraint to include 'accepted' if not already present
-- First, check what the current constraint is (if possible) or just allow the update
-- Since we used 'check (status in (...))' in the original schema, we might need to drop and recreate it
-- However, standard practice in Supabase for this is often just to update the row.
-- Let's ensure the status can be 'fulfilled' or 'accepted'. 
-- The original schema had: status text check (status in ('pending', 'approved', 'fulfilled', 'rejected')) default 'pending'
-- 'fulfilled' is already there, we'll use that as the "Accepted/Confirmed" state.

-- 3. Add a comment for clarity
COMMENT ON COLUMN donation_requests.donation_date IS 'The date the donor is scheduled to give blood';
COMMENT ON COLUMN donation_requests.donation_time IS 'The time the donor is scheduled to give blood';
COMMENT ON COLUMN donation_requests.donation_location IS 'The specific room or area at the hospital';
