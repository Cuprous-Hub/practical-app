-- Table to store student registrations for lab groups
CREATE TABLE IF NOT EXISTS registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  matric_number TEXT UNIQUE NOT NULL,
  department TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  group_number INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast searching by group number
CREATE INDEX IF NOT EXISTS idx_group_number ON registrations(group_number);

-- Row Level Security (RLS)
-- Since this is a simple self-reg app without auth, 
-- we allow anyone with the anon key to read and insert.
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Search Access" ON registrations 
  FOR SELECT USING (true);

CREATE POLICY "Public Registration Access" ON registrations 
  FOR INSERT WITH CHECK (true);
