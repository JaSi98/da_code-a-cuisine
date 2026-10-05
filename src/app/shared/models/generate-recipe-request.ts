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

/** The generator's answer: three different recipes, already saved in the cookbook. */
export interface GenerateRecipeResponse {
  recipes: Recipe[];
}
