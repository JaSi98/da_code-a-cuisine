import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NutritionInfo } from './shared/components/nutrition-info/nutrition-info';
import { NutritionValues } from './shared/models/nutrition-values';

@Component({
  imports: [RouterOutlet, NutritionInfo],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('code-a-cuisine');
  // Temporary preview data; removed after approval.
  protected readonly previewNutrition: NutritionValues = {
    energy: 630,
    protein: 18,
    fat: 24,
    carbs: 58,
  };
}
