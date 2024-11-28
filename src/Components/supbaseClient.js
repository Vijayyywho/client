import { createClient } from "@supabase/supabase-js";

// Replace these with your Supabase project's URL and public API key
const SUPABASE_URL = "https://rvgbnuedurcnwzodpdci.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2Z2JudWVkdXJjbnd6b2RwZGNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIyNTg0MTEsImV4cCI6MjA0NzgzNDQxMX0.BBy7eipkQdAHNcZttlglerWdW1yrTwwgKBc52Eym-7w";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
