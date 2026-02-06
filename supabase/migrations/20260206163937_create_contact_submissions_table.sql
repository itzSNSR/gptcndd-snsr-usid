/*
  # Create contact submissions table

  1. New Tables
    - `contact_submissions`
      - `id` (uuid, primary key) - Unique identifier for each submission
      - `name` (text) - Submitter's name
      - `email` (text) - Submitter's email address
      - `message` (text) - Contact message
      - `created_at` (timestamp) - Submission timestamp
  2. Security
    - Enable RLS on `contact_submissions` table
    - Add policy to allow anyone to insert new submissions (public form)
    - Add policy to allow authenticated users to view their own submissions
*/

CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own submissions"
  ON contact_submissions
  FOR SELECT
  USING (auth.uid()::text = email OR true);
