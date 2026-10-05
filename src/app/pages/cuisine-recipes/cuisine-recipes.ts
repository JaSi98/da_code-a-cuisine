import { Component, computed, effect, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { CuisineInfo, findCuisine } from '../../core/data/cuisines';
import { RecipePage, RecipeRepository } from '../../core/services/recipe-repository';
import { Button } from '../../shared/components/button/button';
import { CookbookRecipeItem } from '../../shared/components/cookbook-recipe-item/cookbook-recipe-item';
import { HeroBanner } from '../../shared/components/hero-banner/hero-banner';
import { Pagination } from '../../shared/components/pagination/pagination';
import { SiteHeader } from '../../shared/components/site-header/site-header';
import { Recipe } from '../../shared/models/recipe';
import { COOKING_TIME_OPTIONS, DIET_OPTIONS } from '../../shared/models/recipe-preferences';

const PAGE_SIZE = 15;
const FIRST_PAGE = 1;
const COOKBOOK_ROUTE = '/cookbook';
const COOKBOOK_RECIPE_ROUTE = '/cookbook/recipe/';
const NO_DIET = 'none';

@Component({
  selector: 'app-cuisine-recipes',
  imports: [Button, CookbookRecipeItem, HeroBanner, Pagination, SiteHeader],
  styleUrl: './cuisine-recipes.scss',
  templateUrl: './cuisine-recipes.html',
})
export class CuisineRecipes {
  private readonly router = inject(Router);
  private readonly repository = inject(RecipeRepository);

  readonly cuisine = input.required<string>();
  /** The page from the query string, so the page survives a reload and the back button. */
  readonly page = input<string | undefined>();

  protected readonly info = computed<CuisineInfo | undefined>(() => findCuisine(this.cuisine()));
  protected readonly currentPage = computed<number>(() => readPage(this.page()));
  // No request is made for an unknown cuisine; the page then leaves for the overview.
  protected readonly pageResource = rxResource({
    params: () => {
      const info = this.info();
      return info ? { cuisine: info.value, page: this.currentPage() } : undefined;
    },
    stream: ({ params }) => this.repository.getByCuisine(params.cuisine, params.page, PAGE_SIZE),
  });
  // A failed resource throws when its value is read, so the value is only read once it exists.
  protected readonly recipePage = computed<RecipePage>(() =>
    this.pageResource.hasValue() ? this.pageResource.value() : { recipes: [], total: 0 },
  );
  protected readonly totalPages = computed<number>(() =>
    Math.max(FIRST_PAGE, Math.ceil(this.recipePage().total / PAGE_SIZE)),
  );

  constructor() {
    effect(() => this.leaveUnknownCuisine());
  }

  /** Returns the position of a recipe across all pages. */
  protected getPosition(index: number): number {
    return (this.currentPage() - 1) * PAGE_SIZE + index + 1;
  }

  /** Returns the link to a recipe, opened from the cookbook. */
  protected getRecipeLink(recipe: Recipe): string {
    return COOKBOOK_RECIPE_ROUTE + recipe.id;
  }

  /** Returns the diet (if any) and the cooking time as tag labels. */
  protected getTags(recipe: Recipe): string[] {
    const diet = DIET_OPTIONS.find((option) => option.value === recipe.diet);
    const time = COOKING_TIME_OPTIONS.find((option) => option.value === recipe.cookingTimeCategory);
    return [recipe.diet === NO_DIET ? null : diet?.label, time?.label].filter(
      (label): label is string => !!label,
    );
  }

  /** Shows another page by changing the query string. */
  protected changePage(page: number): void {
    this.router.navigate([], { queryParams: { page }, queryParamsHandling: 'merge' });
  }

  /** Sends the user to the cookbook overview if the cuisine in the address does not exist. */
  private leaveUnknownCuisine(): void {
    if (!this.info()) {
      this.router.navigateByUrl(COOKBOOK_ROUTE, { replaceUrl: true });
    }
  }
}

/** Reads a page number from the query string; anything invalid means the first page. */
function readPage(value: string | undefined): number {
  const page = Number(value);
  return Number.isInteger(page) && page >= FIRST_PAGE ? page : FIRST_PAGE;
}
