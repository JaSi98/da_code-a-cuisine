import { IngredientUnit } from './ingredient-entry';
import { NutritionValues } from './nutrition-values';
import { CookingTime, Cuisine, Diet } from './recipe-preferences';
import { RecipeStep } from './recipe-step';

/** An ingredient of a recipe; missing ones are not in the user's list and must be bought. */
export interface RecipeIngredient {
  name: string;
  amount: number;
  unit: IngredientUnit;
  isMissing: boolean;
}

/** A recipe as stored in the cookbook and returned by the generator. */
export interface Recipe {
  id: string;
  title: string;
  /** Total time in minutes. */
  cookingTime: number;
  cookingTimeCategory: CookingTime;
  cuisine: Cuisine;
  diet: Diet;
  servings: number;
  cooks: number;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  nutritionPerServing: NutritionValues;
  likes: number;
}
