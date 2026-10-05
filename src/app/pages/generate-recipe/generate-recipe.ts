import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { INGREDIENT_SUGGESTIONS } from '../../core/data/ingredient-suggestions';
import { RecipeRequestStore } from '../../core/services/recipe-request-store';
import { Button } from '../../shared/components/button/button';
import { ErrorDialog } from '../../shared/components/error-dialog/error-dialog';
import { IngredientInput } from '../../shared/components/ingredient-input/ingredient-input';
import { IngredientList } from '../../shared/components/ingredient-list/ingredient-list';
import { SiteHeader } from '../../shared/components/site-header/site-header';

const PREFERENCES_ROUTE = '/generate/preferences';

@Component({
  selector: 'app-generate-recipe',
  imports: [Button, ErrorDialog, IngredientInput, IngredientList, SiteHeader],
  styleUrl: './generate-recipe.scss',
  templateUrl: './generate-recipe.html',
})
export class GenerateRecipe {
  private readonly router = inject(Router);

  protected readonly store = inject(RecipeRequestStore);
  protected readonly suggestions = [...INGREDIENT_SUGGESTIONS];
  protected readonly isErrorOpen = signal<boolean>(false);

  /** Moves on to the preferences, or explains why that is not possible yet. */
  protected goToNextStep(): void {
    if (!this.store.hasIngredients()) {
      this.isErrorOpen.set(true);
      return;
    }
    this.router.navigateByUrl(PREFERENCES_ROUTE);
  }
}
