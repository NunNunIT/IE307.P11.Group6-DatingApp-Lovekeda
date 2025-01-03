CREATE TABLE IF NOT EXISTS public.cart (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  price NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cart_user_id ON public.cart (user_id);
CREATE INDEX IF NOT EXISTS idx_cart_product_id ON public.cart (product_id);


create table public.profiles (
id uuid primary key default uuid_generate_v4(),
user_id uuid references auth.users on delete cascade,
created_at timestamp with time zone default timezone('utc'::text, now()) not null,
updated_at timestamp with time zone default timezone('utc'::text, now()) not null,

-- Basic Information
first_name text,
last_name text,
username text unique,
email text unique,
phone text,

-- Profile Details
age integer check (age >= 18 and age <= 100),
gender text check (gender in ('male', 'female', 'other')),
bio text,

-- Location Information
house_number text,
city text,

-- Profile Media
avatar_url text,
images text[] default array[]::text[],

-- Preferences
hobbies text[] default array[]::text[],
interests text[] default array[]::text[],
gender_preference text check (gender_preference in ('male', 'female', 'all')),

-- Profile Status
is_complete boolean default false,
is_active boolean default true,
last_active timestamp with time zone
);

-- Add indexes for better query performance
create index profiles_user_id_idx on public.profiles(user_id);
create index profiles_username_idx on public.profiles(username);
create index profiles_gender_idx on public.profiles(gender);
create index profiles_age_idx on public.profiles(age);
create index profiles_city_idx on public.profiles(city);