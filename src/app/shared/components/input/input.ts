import { Component, DestroyRef, DoCheck, inject, input, signal } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';

export type InputType = 'text' | 'number';

let nextInputId = 0;

@Component({
  selector: 'app-input',
  styleUrl: './input.scss',
  templateUrl: './input.html',
})
export class Input implements ControlValueAccessor, DoCheck {
  private readonly ngControl = inject(NgControl, { self: true, optional: true });
  private readonly destroyRef = inject(DestroyRef);
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};
  private watchedControl: AbstractControl | null = null;
  private controlSubscription: Subscription | null = null;

  readonly label = input<string | null>(null);
  readonly placeholder = input<string>('');
  readonly type = input<InputType>('text');
  readonly ariaLabel = input<string | null>(null);
  readonly isRequired = input<boolean>(false);

  protected readonly fieldId = `input-${nextInputId++}`;
  protected readonly value = signal<string>('');
  protected readonly isDisabled = signal<boolean>(false);
  protected readonly isInvalid = signal<boolean>(false);

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
    this.destroyRef.onDestroy(() => this.controlSubscription?.unsubscribe());
  }

  /** Follows the form control, because the form directive swaps it when a form is rebuilt. */
  ngDoCheck(): void {
    const control = this.ngControl?.control ?? null;
    if (control !== this.watchedControl) {
      this.watchControl(control);
    }
  }

  /** Writes a value from the form model into the field. */
  writeValue(value: string | number | null): void {
    this.value.set(value === null ? '' : String(value));
  }

  /** Registers the callback that reports value changes to the form. */
  registerOnChange(onChange: (value: string) => void): void {
    this.onChange = onChange;
  }

  /** Registers the callback that reports the touched state to the form. */
  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }

  /** Enables or disables the field when the form control does. */
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  /** Stores the typed value and reports it to the form. */
  protected updateValue(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value.set(value);
    this.onChange(value);
  }

  /** Reports to the form that the user has left the field. */
  protected markAsTouched(): void {
    this.onTouched();
  }

  /** Watches the control so the invalid state also updates after markAllAsTouched(). */
  private watchControl(control: AbstractControl | null): void {
    this.controlSubscription?.unsubscribe();
    this.watchedControl = control;
    this.controlSubscription =
      control?.events.subscribe(() => this.updateInvalidState(control)) ?? null;
    if (control) {
      this.updateInvalidState(control);
    }
  }

  /** Marks the field invalid only after the user has interacted with it. */
  private updateInvalidState(control: AbstractControl): void {
    this.isInvalid.set(control.invalid && control.touched);
  }
}
