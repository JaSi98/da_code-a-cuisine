import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  GenerateRecipeRequest,
  GenerateRecipeResponse,
} from '../../shared/models/generate-recipe-request';
import { Recipe } from '../../shared/models/recipe';

const EXPECTED_RECIPE_COUNT = 3;

/** Sends the user's input to the generator workflow and returns the generated recipes. */
@Injectable({ providedIn: 'root' })
export class RecipeGenerator {
  private readonly http = inject(HttpClient);

  /** Requests three recipes; fails if the answer does not contain exactly three. */
  generate(request: GenerateRecipeRequest): Observable<Recipe[]> {
    return this.http
      .post<GenerateRecipeResponse>(environment.generateRecipeUrl, request)
      .pipe(map((response) => this.checkRecipes(response)));
  }

  /** Makes sure the answer has the expected shape before the page shows it. */
  private checkRecipes(response: GenerateRecipeResponse): Recipe[] {
    if (!Array.isArray(response?.recipes) || response.recipes.length !== EXPECTED_RECIPE_COUNT) {
      throw new Error('The generator returned an unexpected answer.');
    }
    return response.recipes;
  }
}
