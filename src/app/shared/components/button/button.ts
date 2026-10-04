import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

export type ButtonVariant =
  'primary-green' | 'primary-cream' | 'secondary-green' | 'secondary-cream';
export type ButtonType = 'button' | 'submit';

const SECONDARY_VARIANTS: ButtonVariant[] = ['secondary-green', 'secondary-cream'];

@Component({
  selector: 'app-button',
  imports: [NgTemplateOutlet, RouterLink],
  styleUrl: './button.scss',
  templateUrl: './button.html',
})
export class Button {
  readonly variant = input<ButtonVariant>('primary-green');
  readonly label = input.required<string>();
  readonly type = input<ButtonType>('button');
  readonly isDisabled = input<boolean>(false);
  readonly link = input<string | null>(null);

  readonly buttonClick = output<void>();

  protected readonly modifierClass = computed<string>(() => `button--${this.variant()}`);
  protected readonly hasArrow = computed<boolean>(() =>
    SECONDARY_VARIANTS.includes(this.variant()),
  );

  /** Forwards the click to the parent component. */
  protected emitClick(): void {
    this.buttonClick.emit();
  }
}
