import { Component, signal } from '@angular/core';

import { CounterField } from '../../shared/components/counter-field/counter-field';
import { PreferenceGroup } from '../../shared/components/preference-group/preference-group';
import {
  COOKING_TIME_OPTIONS,
  COOKS_RANGE,
  CUISINE_OPTIONS,
  CookingTime,
  Cuisine,
  DIET_OPTIONS,
  Diet,
  SERVINGS_RANGE,
} from '../../shared/models/recipe-preferences';

@Component({
  selector: 'app-preferences',
  imports: [CounterField, PreferenceGroup],
  templateUrl: './preferences.html',
})
export class Preferences {
  protected readonly servingsRange = SERVINGS_RANGE;
  protected readonly cooksRange = COOKS_RANGE;
  protected readonly servings = signal<number>(SERVINGS_RANGE.default);
  protected readonly cooks = signal<number>(COOKS_RANGE.default);
  protected readonly cookingTimeOptions = COOKING_TIME_OPTIONS;
  protected readonly cuisineOptions = CUISINE_OPTIONS;
  protected readonly dietOptions = DIET_OPTIONS;
  protected readonly cookingTime = signal<CookingTime | null>(null);
  protected readonly cuisine = signal<Cuisine | null>(null);
  protected readonly diet = signal<Diet | null>(null);
}
