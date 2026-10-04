export const INGREDIENT_UNITS = ['gram', 'kg', 'ml', 'l', 'piece'] as const;

export type IngredientUnit = (typeof INGREDIENT_UNITS)[number];

/** An ingredient the user has at home, with the available amount. */
export interface IngredientEntry {
  name: string;
  amount: number;
  unit: IngredientUnit;
}

/** Tells the parent which entry changed and what it looks like now. */
export interface IngredientEntryChange {
  index: number;
  entry: IngredientEntry;
}
