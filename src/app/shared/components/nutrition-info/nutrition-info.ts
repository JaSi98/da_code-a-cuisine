import { Component, computed, input, signal } from '@angular/core';

import { NutritionValues } from '../../models/nutrition-values';
import { Tag } from '../tag/tag';

export type NutritionBasis = 'serving' | 'recipe';

type Macronutrient = 'protein' | 'fat' | 'carbs';

/** A macronutrient as shown in the table, with its share of the energy from all macronutrients. */
interface MacronutrientRow {
  key: Macronutrient;
  label: string;
  grams: number;
  percent: number;
}

// Energy per gram, used to compare the macronutrients by their share of the calories.
const KCAL_PER_GRAM: Record<Macronutrient, number> = { protein: 4, fat: 9, carbs: 4 };
const MACRONUTRIENT_LABELS: Record<Macronutrient, string> = {
  protein: 'Protein',
  fat: 'Fat',
  carbs: 'Carbs',
};
const PERCENT = 100;

let nextNutritionInfoId = 0;

@Component({
  selector: 'app-nutrition-info',
  imports: [Tag],
  styleUrl: './nutrition-info.scss',
  templateUrl: './nutrition-info.html',
})
export class NutritionInfo {
  readonly perServing = input.required<NutritionValues>();
  readonly servings = input.required<number>();

  protected readonly titleId = `nutrition-info-title-${nextNutritionInfoId++}`;
  protected readonly basis = signal<NutritionBasis>('serving');
  protected readonly values = computed<NutritionValues>(() =>
    this.basis() === 'serving' ? this.perServing() : this.scale(this.perServing(), this.servings()),
  );
  protected readonly macronutrients = computed<MacronutrientRow[]>(() =>
    this.toRows(this.values()),
  );

  /** Switches between the values per serving and for the whole recipe. */
  protected selectBasis(basis: NutritionBasis): void {
    this.basis.set(basis);
  }

  /** Multiplies all values by the number of servings, rounded to whole numbers. */
  private scale(values: NutritionValues, factor: number): NutritionValues {
    return {
      energy: Math.round(values.energy * factor),
      protein: Math.round(values.protein * factor),
      fat: Math.round(values.fat * factor),
      carbs: Math.round(values.carbs * factor),
    };
  }

  /** Builds the macronutrient rows with each share of the energy from all macronutrients. */
  private toRows(values: NutritionValues): MacronutrientRow[] {
    const keys = Object.keys(KCAL_PER_GRAM) as Macronutrient[];
    const totalKcal = keys.reduce((sum, key) => sum + values[key] * KCAL_PER_GRAM[key], 0);
    return keys.map((key) => ({
      key,
      label: MACRONUTRIENT_LABELS[key],
      grams: values[key],
      percent: this.toPercent(values[key] * KCAL_PER_GRAM[key], totalKcal),
    }));
  }

  /** Returns the share of a part in whole percent, or 0 when there is nothing to compare with. */
  private toPercent(part: number, total: number): number {
    return total ? Math.round((part * PERCENT) / total) : 0;
  }
}
