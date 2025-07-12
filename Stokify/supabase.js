import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://tfvzsriecpzvrnzlvwww.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmdnpzcmllY3B6dnJuemx2d3d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1NTc5NzMsImV4cCI6MjA2NTEzMzk3M30.z1OHvDg0kkgyzmaW_BIho4tTHCXfFXSSH-KjYrPosOg'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
