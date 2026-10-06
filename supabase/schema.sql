-- Recipes created by the recipe generator workflow. The workflow writes with the service role;
-- the web app reads with the publishable key (role anon) and can only change the likes through
-- the function below.

create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  cooking_time integer not null check (cooking_time > 0),
  cooking_time_category text not null check (cooking_time_category in ('quick', 'medium', 'complex')),
  cuisine text not null
    check (cuisine in ('german', 'italian', 'indian', 'japanese', 'gourmet', 'fusion', 'levantine')),
  diet text not null check (diet in ('vegetarian', 'vegan', 'keto', 'none')),
  servings integer not null check (servings between 1 and 12),
  cooks integer not null check (cooks between 1 and 3),
  ingredients jsonb not null,
  steps jsonb not null,
  nutrition_per_serving jsonb not null,
  likes integer not null default 0 check (likes >= 0),
  created_at timestamptz not null default now()
);

create index if not exists recipes_cuisine_created_at_idx on public.recipes (cuisine, created_at desc);
create index if not exists recipes_likes_idx on public.recipes (likes desc);

alter table public.recipes enable row level security;

drop policy if exists "Recipes are readable by everyone" on public.recipes;
create policy "Recipes are readable by everyone" on public.recipes for select using (true);

-- Adds or removes one like; runs with the owner's rights, so the publishable key needs no update
-- access.
create or replace function public.change_recipe_likes(recipe_id uuid, delta integer)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  new_likes integer;
begin
  if delta not in (-1, 1) then
    raise exception 'delta must be 1 or -1';
  end if;
  update public.recipes
    set likes = greatest(likes + delta, 0)
    where id = recipe_id
    returning likes into new_likes;
  return new_likes;
end;
$$;

revoke all on function public.change_recipe_likes(uuid, integer) from public;
grant execute on function public.change_recipe_likes(uuid, integer) to anon;
