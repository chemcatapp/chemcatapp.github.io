# ChemCat Supabase Setup

This document provides instructions to set up your Supabase backend for the ChemCat application.

The error `Could not find the table 'public.profiles'` occurs because the database has not yet been initialized. The React application is trying to access a table that doesn't exist.

## Required Setup: Run the SQL Script

To fix this, you must run the provided `supabase_setup.sql` script in your Supabase project. This is a **one-time action** that will create and configure all necessary database tables, security policies, and functions for all features, including profiles, friends, and the activity feed.

### Instructions

1.  **Go to your Supabase Project:** Log in to your account at [supabase.com](https://supabase.com) and navigate to your ChemCat project.
2.  **Open the SQL Editor:** In the left sidebar, find and click on the "SQL Editor" icon.
3.  **Run the Setup Script:**
    *   Click the `+ New query` button.
    *   Copy the **entire contents** of the `supabase_setup.sql` file.
    *   Paste the script into the query editor.
    *   Click the "RUN" button.

Once the script finishes, your backend will be ready. You should be able to sign up, log in, and all features will work correctly without any more errors.

### What the Script Does:

*   **Creates the `profiles` Table:** This is the main table that stores user data like their name, avatar, learning progress, and identified weak topics.
*   **Creates the `follows` Table:** Manages the social graph, tracking who follows whom.
*   **Creates the `activity` Table:** Stores events like lesson completions and earned badges to generate the "Friends" activity feed.
*   **Sets Up Row Level Security (RLS):** Configures all the necessary security policies to ensure users can only access and modify their own data, while safely viewing public data for social features.
*   **Creates a User Deletion Function:** Sets up a secure function to handle account deletion requests.