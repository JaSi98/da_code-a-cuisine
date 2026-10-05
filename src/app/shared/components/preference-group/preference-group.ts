import { Component, computed, input, model } from '@angular/core';

import { PreferenceOption } from '../../models/recipe-preferences';
import { Tag } from '../tag/tag';

export type PreferenceGroupIcon = 'schedule' | 'globe' | 'restaurant';

const ICON_BASE_PATH = 'assets/icons/';
const ICON_SYMBOL_ID = '.svg#icon';

let nextPreferenceGroupId = 0;

@Component({
  selector: 'app-preference-group',
  imports: [Tag],
  styleUrl: './preference-group.scss',
  templateUrl: './preference-group.html',
})
export class PreferenceGroup<T extends string> {
  readonly legend = input.required<string>();
  readonly icon = input.required<PreferenceGroupIcon>();
  readonly options = input.required<readonly PreferenceOption<T>[]>();
  readonly selected = model<T | null>(null);

  protected readonly hintIdPrefix = `preference-group-hint-${nextPreferenceGroupId++}`;
  protected readonly iconHref = computed<string>(
    () => ICON_BASE_PATH + this.icon() + ICON_SYMBOL_ID,
  );

  /** Makes the clicked option the only selected one of this group. */
  protected select(value: T): void {
    this.selected.set(value);
  }

  /** Returns the element id of the hint below the option at the given position. */
  protected getHintId(index: number): string {
    return `${this.hintIdPrefix}-${index}`;
  }
}
