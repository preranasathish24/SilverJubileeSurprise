/* =============================================================================
   SILVER JUBILEE — Site config (the ONLY file you edit for the live Wishes Wall)
   -----------------------------------------------------------------------------
   Fill in these two values from your Supabase project, then the Wishes Wall saves
   wishes to the cloud and shows them live for everyone (all 50+ guests at once).

   Leave them BLANK and the site keeps working exactly as now (wishes are stored
   only in that person's own browser — fine for a quick demo, not shared).

   ⚠️ The anon/public key is MEANT to be in the browser — it is safe to publish.
   Your data stays protected by the Row Level Security rules you set up in Supabase
   (see SUPABASE-SETUP.md). Never put the *service_role* / secret key here.
   ========================================================================== */
window.SJ_CONFIG = {
  SUPABASE_URL: 'https://mgocvnqpeedwfvtrwkse.supabase.co',        // e.g. 'https://abcdefghijklmnop.supabase.co'
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1nb2N2bnFwZWVkd2Z2dHJ3a3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNTc3MDQsImV4cCI6MjA5NjgzMzcwNH0.OR5fH92yfNZdnU9sj1dt5SAgP-x3RtvGSQs54Fl5Aq0',   // the project's "anon public" key (a long eyJ... string)
};
