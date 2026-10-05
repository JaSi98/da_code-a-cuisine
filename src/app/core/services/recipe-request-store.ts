import { Injectable, computed, signal } from '@angular/core';

import { IngredientEntry, IngredientEntryChange } from '../../shared/models/ingredient-entry';
import {
  COOKS_RANGE,
  RecipePreferences,
  SERVINGS_RANGE,
} from '../../shared/models/recipe-preferences';

const STORAGE_KEY = 'recipe-request';

/** What the user has entered so far; it is sent to the generator after the last step. */
interface RecipeRequestState {
  ingredients: IngredientEntry[];
  preferences: RecipePreferences;
}

const EMPTY_STATE: RecipeRequestState = {
  ingredients: [],
  preferences: {
    servings: SERVINGS_RANGE.default,
    cooks: COOKS_RANGE.default,
    cookingTime: null,
    cuisine: null,
    diet: null,
  },
};

/**
 * Holds the input of the recipe generator across its steps. The state is kept in the
 * session storage, so a reload or going back a step does not lose what was entered.
 */
@Injectable({ providedIn: 'root' })
export class RecipeRequestStore {
  private readonly state = signal<RecipeRequestState>(this.readState());

  readonly ingredients = computed<IngredientEntry[]>(() => this.state().ingredients);
  readonly hasIngredients = computed<boolean>(() => this.ingredients().length > 0);
  readonly preferences = computed<RecipePreferences>(() => this.state().preferences);

  /** Adds an ingredient at the top, so the latest one is the first in the list. */
  addIngredient(entry: IngredientEntry): void {
    this.updateIngredients((ingredients) => [entry, ...ingredients]);
  }

  /** Replaces the ingredient at the given position with its edited version. */
  updateIngredient(change: IngredientEntryChange): void {
    this.updateIngredients((ingredients) =>
      ingredients.map((entry, index) => (index === change.index ? change.entry : entry)),
    );
  }

  /** Removes the ingredient at the given position. */
  removeIngredient(index: number): void {
    this.updateIngredients((ingredients) =>
      ingredients.filter((_, position) => position !== index),
    );
  }

  /** Merges the changed preferences into the stored ones. */
  updatePreferences(change: Partial<RecipePreferences>): void {
    this.state.update((state) => ({
      ...state,
      preferences: { ...state.preferences, ...change },
    }));
    this.writeState(this.state());
  }

  /** Applies a change to the ingredient list and stores the new state. */
  private updateIngredients(change: (ingredients: IngredientEntry[]) => IngredientEntry[]): void {
    this.state.update((state) => ({ ...state, ingredients: change(state.ingredients) }));
    this.writeState(this.state());
  }

  /** Reads the stored state; a missing, broken or blocked storage starts empty. */
  private readState(): RecipeRequestState {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      return stored ? this.mergeWithDefaults(JSON.parse(stored)) : EMPTY_STATE;
    } catch {
      return EMPTY_STATE;
    }
  }

  /** Fills in what an older stored state does not contain yet. */
  private mergeWithDefaults(stored: Partial<RecipeRequestState>): RecipeRequestState {
    return {
      ingredients: stored.ingredients ?? EMPTY_STATE.ingredients,
      preferences: { ...EMPTY_STATE.preferences, ...stored.preferences },
    };
  }

  /** Stores the state; a blocked storage only means the input is not kept on reload. */
  private writeState(state: RecipeRequestState): void {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Nothing to do: the generator keeps working within the current page view.
    }
  }
}
