# Supabase Setup for QA Checklist

To secure your QA Checklist so only you can access it, follow these steps in your [Supabase Dashboard](https://supabase.com/dashboard).

## 1. Create the Table

Go to the **SQL Editor** and run the following script to create a table that stores your project data as a single JSON document (preserving all your existing features).

```sql
create table if not exists qa_projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null default auth.uid(),
  name text default 'Default Project',
  content jsonb,
  updated_at timestamptz default now()
);

-- Auto-update updated_at on every row change (critical for load ordering)
create or replace function qa_projects_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;
drop trigger if exists qa_projects_updated_at_trigger on qa_projects;
create trigger qa_projects_updated_at_trigger
  before update on qa_projects
  for each row execute function qa_projects_updated_at();

-- Enable Row Level Security (RLS)
alter table qa_projects enable row level security;

-- Create Policy: Users can only see their own projects
create policy "Users can view own projects"
  on qa_projects for select
  using (auth.uid() = user_id);

-- Create Policy: Users can insert their own projects
create policy "Users can insert own projects"
  on qa_projects for insert
  with check (auth.uid() = user_id);

-- Create Policy: Users can update their own projects
create policy "Users can update own projects"
  on qa_projects for update
  using (auth.uid() = user_id);

-- Create Policy: Users can delete their own projects
create policy "Users can delete own projects"
  on qa_projects for delete
  using (auth.uid() = user_id);
```

## 2. Get Your Credentials

1. Go to **Settings** > **API**.
2. Copy the **Project URL**.
3. Copy the **anon public** key.

## 3. Configure Your Environment

Create a `.env` file in your project root (`c:\Users\presn\OneDrive\Desktop\CodeRabbit\.env`) and add these keys:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Once this is done, the Login screen will appear in your project.

## 4. (Existing tables) Add updated_at trigger

If you already created the table before, run this in the SQL Editor to fix data sync (ensures deletes persist):

```sql
create or replace function qa_projects_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;
drop trigger if exists qa_projects_updated_at_trigger on qa_projects;
create trigger qa_projects_updated_at_trigger
  before update on qa_projects
  for each row execute function qa_projects_updated_at();
```
