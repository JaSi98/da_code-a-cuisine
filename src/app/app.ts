import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { IngredientList } from './shared/components/ingredient-list/ingredient-list';
import { IngredientEntry } from './shared/models/ingredient-entry';

@Component({
  imports: [RouterOutlet, IngredientList],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('code-a-cuisine');
  // Temporary preview state; removed after approval.
  protected readonly previewEntries = signal<IngredientEntry[]>([
    { name: 'Pasta', amount: 100, unit: 'gram' },
    { name: 'Baby spinach', amount: 100, unit: 'gram' },
    { name: 'Cherry tomatoes', amount: 150, unit: 'gram' },
    { name: 'Egg', amount: 1, unit: 'piece' },
    { name: 'Olive oil', amount: 1000, unit: 'ml' },
  ]);

  /** Replaces an entry after editing in the preview. */
  protected replacePreviewEntry(index: number, entry: IngredientEntry): void {
    this.previewEntries.update((entries) => entries.map((e, i) => (i === index ? entry : e)));
  }

  /** Removes an entry in the preview. */
  protected removePreviewEntry(index: number): void {
    this.previewEntries.update((entries) => entries.filter((_, i) => i !== index));
  }
}
