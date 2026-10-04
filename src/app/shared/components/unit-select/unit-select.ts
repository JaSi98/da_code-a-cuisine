import { Component, ElementRef, computed, inject, input, signal } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

const NO_ACTIVE_OPTION = -1;
let nextUnitSelectId = 0;

@Component({
  selector: 'app-unit-select',
  styleUrl: './unit-select.scss',
  templateUrl: './unit-select.html',
  host: { '(document:click)': 'closeOnOutsideClick($event)' },
})
export class UnitSelect implements ControlValueAccessor {
  private readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly ngControl = inject(NgControl, { self: true, optional: true });
  private readonly keyActions: Record<string, () => void> = {
    ArrowDown: () => this.moveActiveOption(1),
    ArrowUp: () => this.moveActiveOption(-1),
    Enter: () => this.confirmActiveOption(),
    ' ': () => this.confirmActiveOption(),
    Escape: () => this.close(),
  };
  private onChange: (unit: string) => void = () => {};
  private onTouched: () => void = () => {};

  readonly options = input.required<string[]>();
  readonly ariaLabel = input<string>('Unit');

  protected readonly listboxId = `unit-select-listbox-${nextUnitSelectId++}`;
  protected readonly value = signal<string>('');
  protected readonly isDisabled = signal<boolean>(false);
  protected readonly isOpen = signal<boolean>(false);
  protected readonly activeIndex = signal<number>(NO_ACTIVE_OPTION);
  protected readonly activeOptionId = computed<string | null>(() => this.getActiveOptionId());

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  /** Writes a unit from the form model into the select. */
  writeValue(unit: string | null): void {
    this.value.set(unit ?? '');
  }

  /** Registers the callback that reports value changes to the form. */
  registerOnChange(onChange: (unit: string) => void): void {
    this.onChange = onChange;
  }

  /** Registers the callback that reports the touched state to the form. */
  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }

  /** Enables or disables the select when the form control does. */
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  /** Returns the element id of the option at the given position. */
  protected getOptionId(index: number): string {
    return `${this.listboxId}-option-${index}`;
  }

  /** Opens the list if it is closed, otherwise closes it. */
  protected toggle(): void {
    if (this.isOpen()) {
      this.close();
      return;
    }
    this.open();
  }

  /** Runs the keyboard action for the pressed key and suppresses the browser default. */
  protected handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Tab') {
      this.close();
      return;
    }
    const action = this.keyActions[event.key];
    if (!action || this.isEscapeForParent(event.key)) {
      return;
    }
    event.preventDefault();
    action();
  }

  /** Stores the chosen unit, reports it to the form and closes the list. */
  protected selectOption(unit: string): void {
    this.value.set(unit);
    this.onChange(unit);
    this.close();
  }

  /** Highlights the option under the pointer, like keyboard navigation does. */
  protected setActiveIndex(index: number): void {
    this.activeIndex.set(index);
  }

  /** Closes the list when the user clicks anywhere outside of the select. */
  protected closeOnOutsideClick(event: MouseEvent): void {
    const isInsideClick = this.hostElement.nativeElement.contains(event.target as Node);
    if (!isInsideClick && this.isOpen()) {
      this.close();
    }
  }

  /** Returns whether Escape should reach a surrounding dialog because the list is already closed. */
  private isEscapeForParent(key: string): boolean {
    return key === 'Escape' && !this.isOpen();
  }

  /** Opens the list and highlights the current unit. */
  private open(): void {
    this.activeIndex.set(this.options().indexOf(this.value()));
    this.isOpen.set(true);
  }

  /** Closes the list and reports to the form that the select was used. */
  private close(): void {
    this.isOpen.set(false);
    this.activeIndex.set(NO_ACTIVE_OPTION);
    this.onTouched();
  }

  /** Moves the highlight up or down; opens the list first if it is closed. */
  private moveActiveOption(step: number): void {
    if (!this.isOpen()) {
      this.open();
      return;
    }
    const lastIndex = this.options().length - 1;
    this.activeIndex.update((index) => Math.min(Math.max(index + step, 0), lastIndex));
  }

  /** Selects the highlighted unit; opens the list first if it is closed. */
  private confirmActiveOption(): void {
    const activeUnit = this.options()[this.activeIndex()];
    if (!this.isOpen() || activeUnit === undefined) {
      this.toggle();
      return;
    }
    this.selectOption(activeUnit);
  }

  /** Returns the id of the highlighted option for aria-activedescendant. */
  private getActiveOptionId(): string | null {
    const hasActiveOption = this.isOpen() && this.activeIndex() !== NO_ACTIVE_OPTION;
    return hasActiveOption ? this.getOptionId(this.activeIndex()) : null;
  }
}
