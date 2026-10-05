import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { NutritionValues } from '../../shared/models/nutrition-values';
import { Recipe, RecipeIngredient } from '../../shared/models/recipe';
import { CookingTime, Cuisine, Diet } from '../../shared/models/recipe-preferences';
import { RecipeStep } from '../../shared/models/recipe-step';

const REST_PATH = '/rest/v1/';
const RECIPES_TABLE = 'recipes';
const CHANGE_LIKES_FUNCTION = 'rpc/change_recipe_likes';

/** A row of the recipes table, as the database names its columns. */
interface RecipeRow {
  id: string;
  title: string;
  cooking_time: number;
  cooking_time_category: CookingTime;
  cuisine: Cuisine;
  diet: Diet;
  servings: number;
  cooks: number;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  nutrition_per_serving: NutritionValues;
  likes: number;
}

/** One page of a recipe list, together with the number of all matching recipes. */
export interface RecipePage {
  recipes: Recipe[];
  total: number;
}

/** Reads recipes from the cookbook database and changes their likes. */
@Injectable({ providedIn: 'root' })
export class RecipeRepository {
  private readonly http = inject(HttpClient);
  // A publishable key is no JWT, so it goes in the apikey header only, not in Authorization.
  private readonly headers = new HttpHeaders({ apikey: environment.supabasePublishableKey });

  /** Loads one recipe; emits null if there is no recipe with this id. */
  getById(id: string): Observable<Recipe | null> {
    const params = { id: `eq.${id}`, select: '*' };
    return this.http
      .get<RecipeRow[]>(this.tableUrl(), { headers: this.headers, params })
      .pipe(map((rows) => (rows[0] ? toRecipe(rows[0]) : null)));
  }

  /** Loads one page of the recipes of a cuisine, newest first. */
  getByCuisine(cuisine: Cuisine, page: number, pageSize: number): Observable<RecipePage> {
    const params = { cuisine: `eq.${cuisine}`, select: '*', order: 'created_at.desc' };
    const from = (page - 1) * pageSize;
    const headers = this.headers
      .set('Prefer', 'count=exact')
      .set('Range', `${from}-${from + pageSize - 1}`);
    return this.http
      .get<RecipeRow[]>(this.tableUrl(), { headers, params, observe: 'response' })
      .pipe(
        map((response) => ({
          recipes: (response.body ?? []).map(toRecipe),
          total: readTotal(response.headers.get('Content-Range')),
        })),
      );
  }

  /** Loads the recipes with the most likes. */
  getPopular(limit: number): Observable<Recipe[]> {
    const params = { select: '*', order: 'likes.desc', limit: String(limit) };
    return this.http
      .get<RecipeRow[]>(this.tableUrl(), { headers: this.headers, params })
      .pipe(map((rows) => rows.map(toRecipe)));
  }

  /** Adds (1) or removes (-1) a like and emits the new number of likes. */
  changeLikes(id: string, delta: 1 | -1): Observable<number> {
    const url = environment.supabaseUrl + REST_PATH + CHANGE_LIKES_FUNCTION;
    return this.http.post<number>(url, { recipe_id: id, delta }, { headers: this.headers });
  }

  /** Returns the address of the recipes table. */
  private tableUrl(): string {
    return environment.supabaseUrl + REST_PATH + RECIPES_TABLE;
  }
}

/** Converts a database row into the recipe used by the app. */
function toRecipe(row: RecipeRow): Recipe {
  return {
    id: row.id,
    title: row.title,
    cookingTime: row.cooking_time,
    cookingTimeCategory: row.cooking_time_category,
    cuisine: row.cuisine,
    diet: row.diet,
    servings: row.servings,
    cooks: row.cooks,
    ingredients: row.ingredients,
    steps: row.steps,
    nutritionPerServing: row.nutrition_per_serving,
    likes: row.likes,
  };
}

/** Reads the total from a header like "0-9/42"; an unknown total counts as zero. */
function readTotal(contentRange: string | null): number {
  const total = Number(contentRange?.split('/')[1]);
  return Number.isFinite(total) ? total : 0;
}
