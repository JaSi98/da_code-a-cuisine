import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { RecipeRequestStore } from '../../core/services/recipe-request-store';
import { Button } from '../../shared/components/button/button';
import { CounterField } from '../../shared/components/counter-field/counter-field';
import { ErrorDialog } from '../../shared/components/error-dialog/error-dialog';
import { PreferenceGroup } from '../../shared/components/preference-group/preference-group';
import { SiteHeader } from '../../shared/components/site-header/site-header';
import {
  COOKING_TIME_OPTIONS,
  COOKS_RANGE,
  CUISINE_OPTIONS,
  DIET_OPTIONS,
  RecipePreferences,
  SERVINGS_RANGE,
} from '../../shared/models/recipe-preferences';

const RESULTS_ROUTE = '/results';
const INGREDIENTS_ROUTE = '/generate';

/** Text and target of the error dialog, which explains what is still missing. */
interface MissingInputError {
  title: string;
  message: string;
  actionLabel: string;
  actionLink: string;
}

/** The choices that must be made, with the words used to name them in the error message. */
const REQUIRED_CHOICES: readonly [keyof RecipePreferences, string][] = [
  ['cookingTime', 'a cooking time'],
  ['cuisine', 'a cuisine'],
  ['diet', 'a diet'],
];

const NO_INGREDIENTS_ERROR: MissingInputError = {
  title: 'No ingredients yet',
  message: 'Add at least one ingredient to your list, so we can find a recipe that fits.',
  actionLabel: 'Add ingredients',
  actionLink: INGREDIENTS_ROUTE,
};

@Component({
  selector: 'app-preferences',
  imports: [Button, CounterField, ErrorDialog, PreferenceGroup, SiteHeader],
  styleUrl: './preferences.scss',
  templateUrl: './preferences.html',
})
export class Preferences {
  private readonly router = inject(Router);

  protected readonly store = inject(RecipeRequestStore);
  protected readonly ingredientsRoute = INGREDIENTS_ROUTE;
  protected readonly servingsRange = SERVINGS_RANGE;
  protected readonly cooksRange = COOKS_RANGE;
  protected readonly cookingTimeOptions = COOKING_TIME_OPTIONS;
  protected readonly cuisineOptions = CUISINE_OPTIONS;
  protected readonly dietOptions = DIET_OPTIONS;
  protected readonly isErrorOpen = signal<boolean>(false);
  protected readonly error = signal<MissingInputError>(NO_INGREDIENTS_ERROR);

  /** Starts the generation, or explains what is still missing. */
  protected generateRecipe(): void {
    const error = this.findMissingInput();
    if (error) {
      this.error.set(error);
      this.isErrorOpen.set(true);
      return;
    }
    this.router.navigateByUrl(RESULTS_ROUTE);
  }

  /** Returns the error for the first missing input, or null if everything is filled in. */
  private findMissingInput(): MissingInputError | null {
    if (!this.store.hasIngredients()) {
      return NO_INGREDIENTS_ERROR;
    }
    const preferences = this.store.preferences();
    const missing = REQUIRED_CHOICES.filter(([key]) => preferences[key] === null);
    return missing.length > 0 ? this.createChoiceError(missing.map(([, name]) => name)) : null;
  }

  /** Builds the error that lists the choices which are still open. */
  private createChoiceError(missingNames: string[]): MissingInputError {
    return {
      title: 'Almost there',
      message: `Please choose ${this.joinNames(missingNames)} for your recipe.`,
      actionLabel: 'Choose preferences',
      actionLink: this.router.url,
    };
  }

  /** Joins names as in a sentence, e.g. "a, b and c". */
  private joinNames(names: string[]): string {
    return names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names.at(-1)}` : names[0];
  }
}
