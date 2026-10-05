# Code à Cuisine

Code à Cuisine turns the ingredients you already have at home into recipe ideas. You enter what is in your kitchen, choose servings, the number of cooks, cooking time, cuisine and diet, and get three recipes with a step-by-step plan for every cook. All generated recipes are collected in a shared cookbook, where everyone can browse them by cuisine and give their favourites a heart.

## Features

- **Ingredient input** with suggestions while typing, amount and unit per ingredient; entries can be edited and removed.
- **Preferences**: 1–12 servings (default 2), 1–3 cooks, cooking time (quick, medium, complex), cuisine and diet.
- **Three recipes per request**, with the missing ingredients listed separately.
- **Directions per cook**: steps show who does what, parallel steps share a number (e.g. 2a/2b), each cook can filter their own steps and tick them off.
- **Nutrition facts** per serving or for the whole recipe, with the share of each macronutrient.
- **Cookbook** with the most liked recipes, one page per cuisine and pagination.
- **Likes**: one per browser and recipe, can be taken back.
- Responsive from 320 px to wide screens, keyboard and screen reader friendly, reduced motion respected.

## Tech stack

| Part | Technology |
| --- | --- |
| Frontend | Angular 22 (standalone components, signals, zoneless), SCSS |
| Recipe generation | n8n workflow, called through a webhook |
| Database | Supabase (Postgres with row level security) |
| Tests | Vitest via the Angular CLI |

## Getting started

Requirements: Node.js 22 or newer and npm.

```bash
npm install
npm start          # development server on http://localhost:4200
npm run build      # production build in dist/
npm test           # unit tests
```

### Configuration

The endpoints live in [`src/environments/environment.ts`](src/environments/environment.ts):

| Key | Meaning |
| --- | --- |
| `generateRecipeUrl` | Webhook URL of the n8n recipe workflow |
| `supabaseUrl` | URL of the Supabase project |
| `supabasePublishableKey` | Publishable key (`sb_publishable_…`): read access only, plus the like function |

The values in the repository are placeholders. Until they are replaced, generating a recipe and loading the cookbook end in the app's error and empty states.

## Data flow

1. The generator steps keep the input in the session storage (`RecipeRequestStore`), so a reload does not lose it.
2. The results page sends the request to the n8n webhook (`RecipeGenerator`).
3. The workflow validates the input again, creates three recipes, **saves them in Supabase** and returns them with their ids.
4. The cookbook and recipe pages read from Supabase (`RecipeRepository`). The browser never writes recipes; it can only change likes through a database function.

### Request: `POST {generateRecipeUrl}`

```json
{
  "ingredients": [
    { "name": "Pasta", "amount": 100, "unit": "gram" },
    { "name": "Egg", "amount": 2, "unit": "piece" }
  ],
  "servings": 2,
  "cooks": 2,
  "cookingTime": "quick",
  "cuisine": "italian",
  "diet": "vegetarian"
}
```

| Field | Allowed values |
| --- | --- |
| `unit` | `gram`, `kg`, `ml`, `l`, `piece` |
| `servings` | 1–12 |
| `cooks` | 1–3 |
| `cookingTime` | `quick` (up to 20 min), `medium` (20–45 min), `complex` (over 45 min) |
| `cuisine` | `german`, `italian`, `indian`, `japanese`, `gourmet`, `fusion`, `arabic` |
| `diet` | `vegetarian`, `vegan`, `keto`, `none` |

### Response

Exactly three recipes; any other answer is shown as an error.

```json
{
  "recipes": [
    {
      "id": "0f8c…",
      "title": "Pasta with spinach and cherry tomatoes",
      "cookingTime": 20,
      "cookingTimeCategory": "quick",
      "cuisine": "italian",
      "diet": "vegetarian",
      "servings": 2,
      "cooks": 2,
      "ingredients": [
        { "name": "Pasta", "amount": 160, "unit": "gram", "isMissing": false },
        { "name": "Parmesan", "amount": 40, "unit": "gram", "isMissing": true }
      ],
      "steps": [
        { "number": "1", "title": "Cook the pasta", "description": "…", "chef": 1 },
        { "number": "2a", "title": "Make the sauce", "description": "…", "chef": 2 }
      ],
      "nutritionPerServing": { "energy": 630, "protein": 18, "fat": 24, "carbs": 58 },
      "likes": 0
    }
  ]
}
```

`energy` is in kcal, the macronutrients in grams. `chef` is the number of the cook (1–3) who does the step.

## Database

[`supabase/schema.sql`](supabase/schema.sql) creates the `recipes` table, its read-only policy for the public and the function `change_recipe_likes(recipe_id, delta)`, which is the only way the app changes data. Run it once in the SQL editor of the Supabase project.

## Project structure

```
src/app/
├── core/
│   ├── data/          static data (cuisines, ingredient suggestions)
│   └── services/      generator, repository, request store, liked recipes
├── pages/             one folder per route
└── shared/
    ├── components/    reusable UI components
    ├── models/        TypeScript interfaces and types
    └── utils/         small helpers
src/styles/            SCSS (abstracts, base, fonts)
supabase/              database schema
```

## Routes

| Path | Page |
| --- | --- |
| `/` | Home |
| `/generate` | Step 1: ingredients |
| `/generate/preferences` | Step 2: preferences |
| `/results` | Generated recipes (with loading state) |
| `/recipe/:id` | Recipe from the results |
| `/cookbook` | Cookbook overview |
| `/cookbook/:cuisine` | Recipes of one cuisine, `?page=` for pagination |
| `/cookbook/recipe/:id` | Recipe opened from the cookbook |

## Credits

- Fonts: [Quicksand](https://fonts.google.com/specimen/Quicksand) (SIL Open Font License) and [Ubuntu](https://design.ubuntu.com/font) (Ubuntu Font Licence), see `src/styles/fonts/`.
- Icons: [Material Symbols](https://fonts.google.com/icons) (Apache License 2.0), see `public/assets/icons/`.
- Photo of the Arabic cuisine: see `public/assets/cuisines/CREDITS.txt`.
