-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Table: Companies
create table companies (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  job_date text,
  job_link text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: Questions
create table questions (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid references companies(id) on delete cascade not null,
  text text not null,
  answers jsonb default '[]'::jsonb, -- Array of Answer objects
  categories text[],
  order_num int,
  limit_type text,
  limit_count int,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS)
alter table companies enable row level security;
alter table questions enable row level security;

-- Policies for Companies
create policy "Users can view their own companies" 
on companies for select 
using (auth.uid() = user_id);

create policy "Users can insert their own companies" 
on companies for insert 
with check (auth.uid() = user_id);

create policy "Users can update their own companies" 
on companies for update 
using (auth.uid() = user_id);

create policy "Users can delete their own companies" 
on companies for delete 
using (auth.uid() = user_id);

-- Policies for Questions (linked via company)
-- Simplification: Since questions belong to companies, and companies belong to users,
-- we can check if the company belongs to the user.
-- However, for simplicity in RLS, we can simpler queries if we JOIN.
-- Or better: Ensure the app always providing the company_id checks. 
-- A cleaner way for nested RLS is:
-- `using ( company_id in (select id from companies where user_id = auth.uid()) )`

create policy "Users can view questions of their companies" 
on questions for select 
using (
  company_id in (
    select id from companies where user_id = auth.uid()
  )
);

create policy "Users can insert questions to their companies" 
on questions for insert 
with check (
  company_id in (
    select id from companies where user_id = auth.uid()
  )
);

create policy "Users can update questions of their companies" 
on questions for update 
using (
  company_id in (
    select id from companies where user_id = auth.uid()
  )
);

create policy "Users can delete questions of their companies" 
on questions for delete 
using (
  company_id in (
    select id from companies where user_id = auth.uid()
  )
);
