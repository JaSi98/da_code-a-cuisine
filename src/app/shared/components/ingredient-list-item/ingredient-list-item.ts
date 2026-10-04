import {
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { INGREDIENT_UNITS, IngredientEntry, IngredientUnit } from '../../models/ingredient-entry';
import { IconButton } from '../icon-button/icon-button';
import { Input } from '../input/input';
import { UnitSelect } from '../unit-select/unit-select';

const MIN_AMOUNT = 0.01;
const UNIT_SYMBOLS: Record<IngredientUnit, string> = {
  gram: 'g',
  kg: 'kg',
  ml: 'ml',
  l: 'l',
  piece: ' piece',
};

@Component({
  selector: 'app-ingredient-list-item',
  imports: [ReactiveFormsModule, IconButton, Input, UnitSelect],
  styleUrl: './ingredient-list-item.scss',
  templateUrl: './ingredient-list-item.html',
})
export class IngredientListItem {
  private readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);

  readonly entry = input.required<IngredientEntry>();

  readonly entryChange = output<IngredientEntry>();
  readonly entryRemove = output<void>();

  protected readonly units = [...INGREDIENT_UNITS];
  protected readonly isEditing = signal<boolean>(false);
  protected readonly amountControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.min(MIN_AMOUNT)],
  });
  protected readonly unitControl = new FormControl<IngredientUnit>('gram', { nonNullable: true });
  protected readonly formattedAmount = computed<string>(() => this.formatAmount(this.entry()));

  /** Shows the amount and unit as editable fields, filled with the current values. */
  protected startEditing(): void {
    this.amountControl.setValue(String(this.entry().amount));
    this.unitControl.setValue(this.entry().unit);
    this.isEditing.set(true);
    this.focusAfterRender('input');
  }

  /** Reports the changed amount and unit to the parent if the amount is valid. */
  protected confirmEditing(): void {
    this.amountControl.markAsTouched();
    if (this.amountControl.invalid) {
      return;
    }
    const amount = Number(this.amountControl.value);
    this.entryChange.emit({ ...this.entry(), amount, unit: this.unitControl.value });
    this.isEditing.set(false);
    this.focusAfterRender('button');
  }

  /** Asks the parent to remove this ingredient from the list. */
  protected removeEntry(): void {
    this.entryRemove.emit();
  }

  /** Keeps keyboard users in place: the clicked button disappears when the mode changes. */
  private focusAfterRender(selector: string): void {
    afterNextRender(
      () => this.hostElement.nativeElement.querySelector<HTMLElement>(selector)?.focus(),
      { injector: this.injector },
    );
  }

  /** Returns the amount with its unit, e.g. "100g" or "2 pieces". */
  private formatAmount(entry: IngredientEntry): string {
    const isPlural = entry.unit === 'piece' && entry.amount !== 1;
    return `${entry.amount}${UNIT_SYMBOLS[entry.unit]}${isPlural ? 's' : ''}`;
  }
}
