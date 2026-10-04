import { Component, input, output } from '@angular/core';

import { IngredientEntry, IngredientEntryChange } from '../../models/ingredient-entry';
import { IngredientListItem } from '../ingredient-list-item/ingredient-list-item';

@Component({
  selector: 'app-ingredient-list',
  imports: [IngredientListItem],
  styleUrl: './ingredient-list.scss',
  templateUrl: './ingredient-list.html',
})
export class IngredientList {
  readonly entries = input.required<IngredientEntry[]>();

  readonly entryChange = output<IngredientEntryChange>();
  readonly entryRemove = output<number>();

  /** Forwards the edited entry together with its position. */
  protected changeEntry(index: number, entry: IngredientEntry): void {
    this.entryChange.emit({ index, entry });
  }

  /** Forwards the position of the entry that should be removed. */
  protected removeEntry(index: number): void {
    this.entryRemove.emit(index);
  }
}
