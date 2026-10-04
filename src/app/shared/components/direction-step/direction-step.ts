import { Component, input, model } from '@angular/core';

import { ChefNumber, CookLabel } from '../cook-label/cook-label';

@Component({
  selector: 'app-direction-step',
  imports: [CookLabel],
  styleUrl: './direction-step.scss',
  templateUrl: './direction-step.html',
})
export class DirectionStep {
  /** Text, so parallel steps can share a number, e.g. "2a" and "2b". */
  readonly number = input.required<string>();
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly chef = input.required<ChefNumber>();
  readonly isDone = model<boolean>(false);

  /** Marks the step as done or open again. */
  protected toggleDone(event: Event): void {
    this.isDone.set((event.target as HTMLInputElement).checked);
  }
}
