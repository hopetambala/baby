import { createClient } from "@supabase/supabase-js"

export const supabase = createClient(
  "https://gibiskbrwwqydygjjejb.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpYmlza2Jyd3dxeWR5Z2pqZWpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzNzQ3NjksImV4cCI6MjA5Mzk1MDc2OX0.YujCIXbXjAwJVKhwuE7mBZ0MLwDbcFwceK6jr0Zkm6A"
)
