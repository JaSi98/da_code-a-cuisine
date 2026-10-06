import { Injectable, computed, signal } from '@angular/core';

import {
  ExcludedIngredient,
  GenerateRecipeRequest,
} from '../../shared/models/generate-recipe-request';
import { IngredientEntry, IngredientEntryChange } from '../../shared/models/ingredient-entry';
import { Recipe } from '../../shared/models/recipe';
import {
  COOKS_RANGE,
  RecipePreferences,
  SERVINGS_RANGE,
} from '../../shared/models/recipe-preferences';

const STORAGE_KEY = 'recipe-request';

/**
 * What the user has entered so far, and the recipes generated for it. The results are kept
 * until the input changes, so going back from a recipe does not start a new generation.
 */
interface RecipeRequestState {
  ingredients: IngredientEntry[];
  preferences: RecipePreferences;
  results: Recipe[] | null;
  /** Ingredients the generator did not use because they do not fit the diet. */
  excludedIngredients: ExcludedIngredient[];
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
  results: null,
  excludedIngredients: [],
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
  readonly results = computed<Recipe[] | null>(() => this.state().results);
  readonly excludedIngredients = computed<ExcludedIngredient[]>(
    () => this.state().excludedIngredients,
  );
  readonly request = computed<GenerateRecipeRequest | null>(() => this.buildRequest());

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
    const state = this.state();
    this.setState({ ...state, preferences: { ...state.preferences, ...change }, results: null });
  }

  /** Keeps the generated recipes for the current input, with the ingredients left out. */
  setResults(results: Recipe[], excludedIngredients: ExcludedIngredient[] = []): void {
    this.setState({ ...this.state(), results, excludedIngredients });
  }

  /** Clears everything, so the generator starts again from the first step. */
  reset(): void {
    this.setState(EMPTY_STATE);
  }

  /** Applies a change to the ingredient list; earlier results no longer fit the new list. */
  private updateIngredients(change: (ingredients: IngredientEntry[]) => IngredientEntry[]): void {
    const state = this.state();
    this.setState({ ...state, ingredients: change(state.ingredients), results: null });
  }

  /** Replaces the state and keeps a copy in the session storage. */
  private setState(state: RecipeRequestState): void {
    this.state.set(state);
    this.writeState(state);
  }

  /** Returns the data for the generator, or null while something is still missing. */
  private buildRequest(): GenerateRecipeRequest | null {
    const { servings, cooks, cookingTime, cuisine, diet } = this.preferences();
    if (!this.hasIngredients() || !cookingTime || !cuisine || !diet) {
      return null;
    }
    return { ingredients: this.ingredients(), servings, cooks, cookingTime, cuisine, diet };
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
      results: stored.results ?? null,
      excludedIngredients: stored.excludedIngredients ?? [],
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
