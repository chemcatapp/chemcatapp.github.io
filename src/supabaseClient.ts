import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eiirmqvuuosyzzdbtvar.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpaXJtcXZ1dW9zeXp6ZGJ0dmFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNjI3NjMsImV4cCI6MjA3NDkzODc2M30.zGnm-GTve0c91xKgOKcmcANejveJr1GhRaykVAMi0n8';

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL or Anon Key is missing in supabaseClient.ts.");
    // This is a critical error for the app's functionality.
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);