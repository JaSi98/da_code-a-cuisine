export const COOKING_TIMES = ['quick', 'medium', 'complex'] as const;
export const CUISINES = [
  'german',
  'italian',
  'indian',
  'japanese',
  'gourmet',
  'fusion',
  'arabic',
] as const;
export const DIETS = ['vegetarian', 'vegan', 'keto', 'none'] as const;

export type CookingTime = (typeof COOKING_TIMES)[number];
export type Cuisine = (typeof CUISINES)[number];
export type Diet = (typeof DIETS)[number];

/** Limits and defaults for the counters, as the recipe generator supports them. */
export const SERVINGS_RANGE = { min: 1, max: 12, default: 2 } as const;
export const COOKS_RANGE = { min: 1, max: 3, default: 1 } as const;

/** How the user wants to cook; a choice is null until the user has picked one. */
export interface RecipePreferences {
  servings: number;
  cooks: number;
  cookingTime: CookingTime | null;
  cuisine: Cuisine | null;
  diet: Diet | null;
}

/** One choice of a preference group; the hint is shown below the tag, e.g. a duration. */
export interface PreferenceOption<T extends string> {
  value: T;
  label: string;
  hint?: string;
}

export const COOKING_TIME_OPTIONS: readonly PreferenceOption<CookingTime>[] = [
  { value: 'quick', label: 'Quick', hint: 'up to 20 min' },
  { value: 'medium', label: 'Medium', hint: '20–45 min' },
  { value: 'complex', label: 'Complex', hint: 'over 45 min' },
];

export const CUISINE_OPTIONS: readonly PreferenceOption<Cuisine>[] = [
  { value: 'german', label: 'German' },
  { value: 'italian', label: 'Italian' },
  { value: 'indian', label: 'Indian' },
  { value: 'japanese', label: 'Japanese' },
  { value: 'gourmet', label: 'Gourmet' },
  { value: 'fusion', label: 'Fusion' },
  { value: 'arabic', label: 'Arabic' },
];

export const DIET_OPTIONS: readonly PreferenceOption<Diet>[] = [
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'keto', label: 'Keto' },
  { value: 'none', label: 'No preferences' },
];
