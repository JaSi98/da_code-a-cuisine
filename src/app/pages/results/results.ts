import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { RecipeGenerator } from '../../core/services/recipe-generator';
import { RecipeRequestStore } from '../../core/services/recipe-request-store';
import { Button } from '../../shared/components/button/button';
import { ErrorDialog } from '../../shared/components/error-dialog/error-dialog';
import { LoadingIndicator } from '../../shared/components/loading-indicator/loading-indicator';
import { RecipeCard } from '../../shared/components/recipe-card/recipe-card';
import { SiteHeader } from '../../shared/components/site-header/site-header';
import { Tag } from '../../shared/components/tag/tag';
import { GenerateRecipeRequest } from '../../shared/models/generate-recipe-request';
import { Recipe } from '../../shared/models/recipe';
import {
  COOKING_TIME_OPTIONS,
  CUISINE_OPTIONS,
  PreferenceOption,
} from '../../shared/models/recipe-preferences';

type ResultsStatus = 'loading' | 'ready' | 'failed';

const INGREDIENTS_ROUTE = '/generate';
const RECIPE_ROUTE = '/recipe/';

@Component({
  selector: 'app-results',
  imports: [Button, ErrorDialog, LoadingIndicator, RecipeCard, SiteHeader, Tag],
  styleUrl: './results.scss',
  templateUrl: './results.html',
})
export class Results {
  private readonly router = inject(Router);
  private readonly generator = inject(RecipeGenerator);
  private readonly destroyRef = inject(DestroyRef);
  private readonly store = inject(RecipeRequestStore);

  protected readonly recipes = computed<Recipe[]>(() => this.store.results() ?? []);
  protected readonly status = signal<ResultsStatus>(this.store.results() ? 'ready' : 'loading');
  protected readonly isErrorOpen = signal<boolean>(false);
  protected readonly choiceLabels = computed<string[]>(() => this.getChoiceLabels());

  constructor() {
    if (this.status() === 'loading') {
      this.startGeneration();
    }
  }

  /** Returns the link to the detail page of a recipe. */
  protected getRecipeLink(recipe: Recipe): string {
    return RECIPE_ROUTE + recipe.id;
  }

  /** Clears the current input and goes back to the first step. */
  protected startOver(): void {
    this.store.reset();
    this.router.navigateByUrl(INGREDIENTS_ROUTE);
  }

  /** Generates recipes for the stored input, or sends the user back if it is incomplete. */
  private startGeneration(): void {
    const request = this.store.request();
    if (!request) {
      this.router.navigateByUrl(INGREDIENTS_ROUTE, { replaceUrl: true });
      return;
    }
    this.requestRecipes(request);
  }

  /** Calls the generator and shows the recipes, or the error dialog if it fails. */
  private requestRecipes(request: GenerateRecipeRequest): void {
    this.generator
      .generate(request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (recipes) => this.showRecipes(recipes),
        error: () => this.showError(),
      });
  }

  /** Keeps the recipes for this input and shows them. */
  private showRecipes(recipes: Recipe[]): void {
    this.store.setResults(recipes);
    this.status.set('ready');
  }

  /** Stops the loading animation and explains that the generation failed. */
  private showError(): void {
    this.status.set('failed');
    this.isErrorOpen.set(true);
  }

  /** Returns the labels of the chosen cuisine and cooking time, shown as tags. */
  private getChoiceLabels(): string[] {
    const { cuisine, cookingTime } = this.store.preferences();
    return [
      findLabel(CUISINE_OPTIONS, cuisine),
      findLabel(COOKING_TIME_OPTIONS, cookingTime),
    ].filter((label): label is string => label !== null);
  }
}

/** Returns the label of the option with the given value, or null if none is chosen. */
function findLabel<T extends string>(
  options: readonly PreferenceOption<T>[],
  value: T | null,
): string | null {
  return options.find((option) => option.value === value)?.label ?? null;
}
