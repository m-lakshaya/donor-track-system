-- Add new columns to donation_requests table
ALTER TABLE donation_requests 
ADD COLUMN IF NOT EXISTS preferred_date DATE,
ADD COLUMN IF NOT EXISTS preferred_time TIME,
ADD COLUMN IF NOT EXISTS venue TEXT;
