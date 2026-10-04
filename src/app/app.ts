import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { IngredientListItem } from './shared/components/ingredient-list-item/ingredient-list-item';
import { IngredientEntry } from './shared/models/ingredient-entry';

@Component({
  imports: [RouterOutlet, IngredientListItem],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('code-a-cuisine');
  // Temporary preview state; removed after approval.
  protected readonly previewEntries = signal<IngredientEntry[]>([
    { name: 'Pasta', amount: 100, unit: 'gram' },
    { name: 'Cherry tomatoes', amount: 6, unit: 'piece' },
    { name: 'Spinach', amount: 1, unit: 'kg' },
    { name: 'Olive oil', amount: 50, unit: 'ml' },
  ]);

  /** Replaces an entry after editing in the preview. */
  protected replacePreviewEntry(oldEntry: IngredientEntry, newEntry: IngredientEntry): void {
    this.previewEntries.update((entries) => entries.map((e) => (e === oldEntry ? newEntry : e)));
  }

  /** Removes an entry in the preview. */
  protected removePreviewEntry(entry: IngredientEntry): void {
    this.previewEntries.update((entries) => entries.filter((e) => e !== entry));
  }
}
