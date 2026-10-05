import { Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

import { CUISINES } from '../../core/data/cuisines';
import { RecipeRepository } from '../../core/services/recipe-repository';
import { CuisineCard } from '../../shared/components/cuisine-card/cuisine-card';
import { PopularRecipeCard } from '../../shared/components/popular-recipe-card/popular-recipe-card';
import { SiteHeader } from '../../shared/components/site-header/site-header';
import { Button } from '../../shared/components/button/button';
import { Recipe } from '../../shared/models/recipe';

const POPULAR_RECIPE_COUNT = 10;
const COOKBOOK_RECIPE_ROUTE = '/cookbook/recipe/';
const COOKBOOK_ROUTE = '/cookbook/';

@Component({
  selector: 'app-cookbook',
  imports: [Button, CuisineCard, PopularRecipeCard, SiteHeader],
  styleUrl: './cookbook.scss',
  templateUrl: './cookbook.html',
})
export class Cookbook {
  private readonly repository = inject(RecipeRepository);

  protected readonly cuisines = CUISINES;
  protected readonly popularResource = rxResource({
    stream: () => this.repository.getPopular(POPULAR_RECIPE_COUNT),
  });
  // A failed resource throws when its value is read, so the value is only read once it exists.
  protected readonly popularRecipes = computed<Recipe[]>(() =>
    this.popularResource.hasValue() ? this.popularResource.value() : [],
  );

  /** Returns the link to a recipe, opened from the cookbook. */
  protected getRecipeLink(recipe: Recipe): string {
    return COOKBOOK_RECIPE_ROUTE + recipe.id;
  }

  /** Returns the link to the recipe list of a cuisine. */
  protected getCuisineLink(cuisine: string): string {
    return COOKBOOK_ROUTE + cuisine;
  }
}
