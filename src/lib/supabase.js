import { createClient } from "@supabase/supabase-js"

let supabaseClient = null

export function getSupabaseClient() {
  if (supabaseClient) return supabaseClient

  const supabaseUrl = process.env.GATSBY_SUPABASE_URL
  const supabaseAnonKey = process.env.GATSBY_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) return null

  supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  return supabaseClient
}
