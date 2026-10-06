import { Component, DestroyRef, computed, inject, input, linkedSignal } from '@angular/core';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

import { LikedRecipes } from '../../core/services/liked-recipes';
import { RecipeRepository } from '../../core/services/recipe-repository';
import { RecipeRequestStore } from '../../core/services/recipe-request-store';
import { Button } from '../../shared/components/button/button';
import { CookLabel } from '../../shared/components/cook-label/cook-label';
import { DirectionList } from '../../shared/components/direction-list/direction-list';
import { ErrorDialog } from '../../shared/components/error-dialog/error-dialog';
import { HeroBanner } from '../../shared/components/hero-banner/hero-banner';
import { LikeButton } from '../../shared/components/like-button/like-button';
import { LikeCount } from '../../shared/components/like-count/like-count';
import { LoadingIndicator } from '../../shared/components/loading-indicator/loading-indicator';
import { NutritionInfo } from '../../shared/components/nutrition-info/nutrition-info';
import { SiteHeader } from '../../shared/components/site-header/site-header';
import { Tag } from '../../shared/components/tag/tag';
import { Recipe as RecipeData, RecipeIngredient } from '../../shared/models/recipe';
import {
  COOKING_TIME_OPTIONS,
  DIET_OPTIONS,
  PreferenceOption,
} from '../../shared/models/recipe-preferences';
import { ChefNumber } from '../../shared/models/recipe-step';
import { formatAmount } from '../../shared/utils/format-amount';

/** Where the back link leads, depending on how the user came to the recipe. */
interface BackLink {
  link: string;
  label: string;
}

const COOKBOOK_ORIGIN = 'cookbook';
const COOKBOOK_ROUTE = '/cookbook';
const RESULTS_ROUTE = '/results';
const GENERATOR_ROUTE = '/generate';

@Component({
  selector: 'app-recipe',
  imports: [
    Button,
    CookLabel,
    DirectionList,
    ErrorDialog,
    HeroBanner,
    LikeButton,
    LikeCount,
    LoadingIndicator,
    NutritionInfo,
    SiteHeader,
    Tag,
  ],
  styleUrl: './recipe.scss',
  templateUrl: './recipe.html',
  host: { '[class.is-loading]': 'recipeResource.isLoading()' },
})
export class Recipe {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly repository = inject(RecipeRepository);
  private readonly requestStore = inject(RecipeRequestStore);
  private readonly likedRecipes = inject(LikedRecipes);

  readonly id = input.required<string>();
  /** Set to "cookbook" by the cookbook route, so the back link returns there. */
  readonly origin = input<string | undefined>();

  protected readonly recipeResource = rxResource({
    params: () => this.id(),
    stream: ({ params }) => this.loadRecipe(params),
  });
  // A failed resource throws when its value is read, so the value is only read once it exists.
  protected readonly recipe = computed<RecipeData | null>(() =>
    this.recipeResource.hasValue() ? this.recipeResource.value() : null,
  );
  protected readonly isMissing = computed<boolean>(
    () =>
      this.recipeResource.status() === 'error' ||
      (this.recipeResource.hasValue() && this.recipeResource.value() === null),
  );
  protected readonly likes = linkedSignal<number>(() => this.recipe()?.likes ?? 0);
  protected readonly isLiked = computed<boolean>(() => this.likedRecipes.isLiked(this.id()));
  protected readonly backLink = computed<BackLink>(() => this.getBackLink());
  protected readonly tagLabels = computed<string[]>(() => this.getTagLabels());
  protected readonly ownIngredients = computed<RecipeIngredient[]>(() =>
    (this.recipe()?.ingredients ?? []).filter((ingredient) => !ingredient.isMissing),
  );
  protected readonly extraIngredients = computed<RecipeIngredient[]>(() =>
    (this.recipe()?.ingredients ?? []).filter((ingredient) => ingredient.isMissing),
  );
  protected readonly chefs = computed<ChefNumber[]>(() =>
    Array.from({ length: this.recipe()?.cooks ?? 0 }, (_, index) => (index + 1) as ChefNumber),
  );

  /** Returns an ingredient's amount with its unit, e.g. "100g". */
  protected formatAmount(ingredient: RecipeIngredient): string {
    return formatAmount(ingredient.amount, ingredient.unit);
  }

  /** Likes the recipe or takes the like back; the count updates at once and is then saved. */
  protected toggleLike(): void {
    const delta = this.isLiked() ? -1 : 1;
    this.applyLike(delta);
    this.repository
      .changeLikes(this.id(), delta)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (likes) => this.likes.set(likes),
        error: () => this.applyLike(delta === 1 ? -1 : 1),
      });
  }

  /** Closing the "not found" dialog leads to the cookbook, as there is no recipe to show. */
  protected handleMissingDialog(isOpen: boolean): void {
    if (!isOpen) {
      this.router.navigateByUrl(COOKBOOK_ROUTE);
    }
  }

  /** Clears the generator input and starts a new recipe. */
  protected startOver(): void {
    this.requestStore.reset();
    this.router.navigateByUrl(GENERATOR_ROUTE);
  }

  /** Shows the like change before the database has answered. */
  private applyLike(delta: 1 | -1): void {
    this.likedRecipes.setLiked(this.id(), delta === 1);
    this.likes.update((likes) => Math.max(0, likes + delta));
  }

  /** Takes a just generated recipe from the results, otherwise loads it from the cookbook. */
  private loadRecipe(id: string): Observable<RecipeData | null> {
    const generated = this.requestStore.results()?.find((recipe) => recipe.id === id);
    return generated ? of(generated) : this.repository.getById(id);
  }

  /** Leads back to the cookbook or to the results, depending on where the user came from. */
  private getBackLink(): BackLink {
    const recipe = this.recipe();
    if (this.origin() === COOKBOOK_ORIGIN || !this.requestStore.results()) {
      const link = recipe ? `${COOKBOOK_ROUTE}/${recipe.cuisine}` : COOKBOOK_ROUTE;
      return { link, label: 'Cookbook' };
    }
    return { link: RESULTS_ROUTE, label: 'Recipe results' };
  }

  /** Returns the labels of the diet and the cooking time, shown as tags. */
  private getTagLabels(): string[] {
    const recipe = this.recipe();
    if (!recipe) {
      return [];
    }
    return [
      findLabel(DIET_OPTIONS, recipe.diet),
      findLabel(COOKING_TIME_OPTIONS, recipe.cookingTimeCategory),
    ];
  }
}

/** Returns the label of the option with the given value. */
function findLabel<T extends string>(options: readonly PreferenceOption<T>[], value: T): string {
  return options.find((option) => option.value === value)?.label ?? value;
}
