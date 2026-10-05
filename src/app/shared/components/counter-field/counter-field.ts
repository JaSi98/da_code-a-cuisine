import { Component, computed, input, model } from '@angular/core';

import { IconButton } from '../icon-button/icon-button';

let nextCounterFieldId = 0;

@Component({
  selector: 'app-counter-field',
  imports: [IconButton],
  styleUrl: './counter-field.scss',
  templateUrl: './counter-field.html',
})
export class CounterField {
  readonly label = input.required<string>();
  readonly unit = input.required<string>();
  readonly unitPlural = input.required<string>();
  readonly min = input<number>(1);
  readonly max = input<number>(Number.MAX_SAFE_INTEGER);
  readonly value = model.required<number>();

  protected readonly labelId = `counter-field-label-${nextCounterFieldId++}`;
  protected readonly unitLabel = computed<string>(() =>
    this.value() === 1 ? this.unit() : this.unitPlural(),
  );
  protected readonly isAtMin = computed<boolean>(() => this.value() <= this.min());
  protected readonly isAtMax = computed<boolean>(() => this.value() >= this.max());

  /** Lowers the value by one, but not below the minimum. */
  protected decrease(): void {
    this.value.update((value) => Math.max(this.min(), value - 1));
  }

  /** Raises the value by one, but not above the maximum. */
  protected increase(): void {
    this.value.update((value) => Math.min(this.max(), value + 1));
  }
}
