import { Component, input, output } from '@angular/core';

import { IngredientEntry } from '../../models/ingredient-entry';
import { IngredientListItem } from '../ingredient-list-item/ingredient-list-item';

/** Tells the parent which entry changed and what it looks like now. */
export interface IngredientEntryChange {
  index: number;
  entry: IngredientEntry;
}

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
