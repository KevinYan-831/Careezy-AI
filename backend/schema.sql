-- Create profiles table
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  subscription_tier text default 'free',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create resumes table
create table public.resumes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  content jsonb default '{}'::jsonb,
  template_id text,
  is_public boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create subscriptions table
create table public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text,
  price_id text,
  current_period_end timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create coaching_sessions table
create table public.coaching_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text,
  session_type text default 'general',
  is_active boolean default true,
  total_tokens integer default 0,
  total_cost numeric(10, 5) default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create coaching_messages table
create table public.coaching_messages (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references public.coaching_sessions not null,
  role text not null, -- 'user' or 'assistant'
  content text not null,
  tokens integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create usage_logs table
create table public.usage_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  action_type text not null, -- 'ai_message', 'resume_create', etc.
  details jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.resumes enable row level security;
alter table public.subscriptions enable row level security;
alter table public.coaching_sessions enable row level security;
alter table public.coaching_messages enable row level security;
alter table public.usage_logs enable row level security;

-- Create policies
-- Profiles
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Resumes
create policy "Users can view own resumes" on public.resumes
  for select using (auth.uid() = user_id);
create policy "Users can insert own resumes" on public.resumes
  for insert with check (auth.uid() = user_id);
create policy "Users can update own resumes" on public.resumes
  for update using (auth.uid() = user_id);
create policy "Users can delete own resumes" on public.resumes
  for delete using (auth.uid() = user_id);

-- Subscriptions
create policy "Users can view own subscription" on public.subscriptions
  for select using (auth.uid() = user_id);

-- Coaching Sessions
create policy "Users can view own sessions" on public.coaching_sessions
  for select using (auth.uid() = user_id);
create policy "Users can insert own sessions" on public.coaching_sessions
  for insert with check (auth.uid() = user_id);
create policy "Users can update own sessions" on public.coaching_sessions
  for update using (auth.uid() = user_id);
create policy "Users can delete own sessions" on public.coaching_sessions
  for delete using (auth.uid() = user_id);

-- Coaching Messages
create policy "Users can view own messages" on public.coaching_messages
  for select using (
    exists (
      select 1 from public.coaching_sessions
      where id = coaching_messages.session_id
      and user_id = auth.uid()
    )
  );
create policy "Users can insert own messages" on public.coaching_messages
  for insert with check (
    exists (
      select 1 from public.coaching_sessions
      where id = coaching_messages.session_id
      and user_id = auth.uid()
    )
  );

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
