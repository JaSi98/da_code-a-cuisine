import { Component, computed, input, output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { INGREDIENT_UNITS, IngredientEntry, IngredientUnit } from '../../models/ingredient-entry';
import { IconButton } from '../icon-button/icon-button';
import { Input } from '../input/input';
import { UnitSelect } from '../unit-select/unit-select';

const DEFAULT_UNIT: IngredientUnit = 'gram';
const MAX_SUGGESTIONS = 5;
const MIN_AMOUNT = 0.01;
const NO_ACTIVE_SUGGESTION = -1;
let nextIngredientInputId = 0;

/** Rejects empty names and names that consist only of whitespace. */
function requiredText(control: AbstractControl<string>): ValidationErrors | null {
  return control.value.trim().length > 0 ? null : { required: true };
}

@Component({
  selector: 'app-ingredient-input',
  imports: [ReactiveFormsModule, IconButton, Input, UnitSelect],
  styleUrl: './ingredient-input.scss',
  templateUrl: './ingredient-input.html',
})
export class IngredientInput {
  private readonly keyActions: Record<string, (event: KeyboardEvent) => void> = {
    ArrowDown: (event) => this.moveActiveSuggestion(event, 1),
    ArrowUp: (event) => this.moveActiveSuggestion(event, -1),
    Enter: (event) => this.confirmActiveSuggestion(event),
    Tab: (event) => this.acceptCompletion(event),
    ArrowRight: (event) => this.acceptCompletion(event),
    Escape: () => this.closeSuggestions(),
  };

  readonly suggestions = input<string[]>([]);
  readonly ingredientAdd = output<IngredientEntry>();

  protected readonly units = [...INGREDIENT_UNITS];
  protected readonly suggestionListId = `ingredient-suggestions-${nextIngredientInputId++}`;
  protected readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: requiredText }),
    amount: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.min(MIN_AMOUNT)],
    }),
    unit: new FormControl<IngredientUnit>(DEFAULT_UNIT, { nonNullable: true }),
  });
  protected readonly activeIndex = signal<number>(NO_ACTIVE_SUGGESTION);
  protected readonly isSuggestionListClosed = signal<boolean>(false);

  private readonly typedName = toSignal(this.form.controls.name.valueChanges, {
    initialValue: '',
  });

  protected readonly matchingSuggestions = computed<string[]>(() => this.findMatches());
  protected readonly isSuggestionListOpen = computed<boolean>(
    () => this.matchingSuggestions().length > 0 && !this.isSuggestionListClosed(),
  );
  protected readonly completion = computed<string>(() => this.getCompletion());
  protected readonly activeSuggestionId = computed<string | null>(() =>
    this.activeIndex() === NO_ACTIVE_SUGGESTION ? null : this.getSuggestionId(this.activeIndex()),
  );

  /** Returns the element id of the suggestion at the given position. */
  protected getSuggestionId(index: number): string {
    return `${this.suggestionListId}-option-${index}`;
  }

  /** Opens the suggestions again and resets the highlight while the user types. */
  protected handleTyping(): void {
    this.isSuggestionListClosed.set(false);
    this.activeIndex.set(NO_ACTIVE_SUGGESTION);
  }

  /** Runs the keyboard action for suggestions and completion in the name field. */
  protected handleNameKeydown(event: KeyboardEvent): void {
    this.keyActions[event.key]?.(event);
  }

  /** Takes over the clicked suggestion as ingredient name. */
  protected selectSuggestion(suggestion: string): void {
    this.form.controls.name.setValue(suggestion);
    this.closeSuggestions();
  }

  /** Highlights the suggestion under the pointer, like keyboard navigation does. */
  protected setActiveIndex(index: number): void {
    this.activeIndex.set(index);
  }

  /** Reports a valid ingredient to the parent and empties the fields for the next one. */
  protected addIngredient(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    this.ingredientAdd.emit(this.toIngredientEntry());
    this.form.reset();
  }

  /** Returns up to MAX_SUGGESTIONS suggestions that start with the typed text. */
  private findMatches(): string[] {
    const typed = this.typedName().trim().toLowerCase();
    if (!typed) {
      return [];
    }
    return this.suggestions()
      .filter((suggestion) => suggestion.toLowerCase().startsWith(typed))
      .filter((suggestion) => suggestion.toLowerCase() !== typed)
      .slice(0, MAX_SUGGESTIONS);
  }

  /** Returns the rest of the first suggestion, shown light after the typed text. */
  private getCompletion(): string {
    const typed = this.typedName();
    const firstMatch = this.matchingSuggestions()[0];
    if (!this.isSuggestionListOpen() || !firstMatch || typed !== typed.trimStart()) {
      return '';
    }
    return firstMatch.slice(typed.length);
  }

  /** Moves the highlight through the suggestions. */
  private moveActiveSuggestion(event: KeyboardEvent, step: number): void {
    if (!this.isSuggestionListOpen()) {
      return;
    }
    event.preventDefault();
    const lastIndex = this.matchingSuggestions().length - 1;
    this.activeIndex.update((index) => Math.min(Math.max(index + step, 0), lastIndex));
  }

  /** Takes over the highlighted suggestion with Enter instead of submitting anything. */
  private confirmActiveSuggestion(event: KeyboardEvent): void {
    const activeSuggestion = this.matchingSuggestions()[this.activeIndex()];
    if (!this.isSuggestionListOpen() || !activeSuggestion) {
      return;
    }
    event.preventDefault();
    this.selectSuggestion(activeSuggestion);
  }

  /** Completes the name with the light hint; without a hint the key keeps its normal job. */
  private acceptCompletion(event: KeyboardEvent): void {
    const completion = this.completion();
    if (!completion) {
      return;
    }
    event.preventDefault();
    this.selectSuggestion(this.typedName() + completion);
  }

  /** Hides the suggestions until the user types again. */
  private closeSuggestions(): void {
    this.isSuggestionListClosed.set(true);
    this.activeIndex.set(NO_ACTIVE_SUGGESTION);
  }

  /** Converts the valid form into the entry that is reported to the parent. */
  private toIngredientEntry(): IngredientEntry {
    const { name, amount, unit } = this.form.getRawValue();
    return { name: name.trim(), amount: Number(amount), unit };
  }
}
