import { IngredientEntry } from './ingredient-entry';
import { Recipe } from './recipe';
import { CookingTime, Cuisine, Diet } from './recipe-preferences';

/** The data sent to the recipe generator once all steps are filled in. */
export interface GenerateRecipeRequest {
  ingredients: IngredientEntry[];
  servings: number;
  cooks: number;
  cookingTime: CookingTime;
  cuisine: Cuisine;
  diet: Diet;
}

/** How many generations are left today for the requesting IP address. */
export interface RecipeQuotaInfo {
  remaining: number;
  limit: number;
}

/** A user ingredient the generator left out because it does not fit the chosen diet. */
export interface ExcludedIngredient {
  name: string;
  reason: string;
}

/** The generator's answer: three different recipes, already saved in the cookbook. */
export interface GenerateRecipeResponse {
  recipes: Recipe[];
  excludedIngredients?: ExcludedIngredient[];
  quota?: RecipeQuotaInfo;
}
