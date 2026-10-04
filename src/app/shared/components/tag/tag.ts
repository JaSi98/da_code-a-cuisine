import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-tag',
  styleUrl: './tag.scss',
  templateUrl: './tag.html',
})
export class Tag {
  readonly label = input.required<string>();
  readonly isActive = input<boolean>(false);
  readonly isInteractive = input<boolean>(true);
  readonly isDisabled = input<boolean>(false);

  readonly tagClick = output<void>();

  /** Forwards the click to the parent component, which decides about the active state. */
  protected emitClick(): void {
    this.tagClick.emit();
  }
}
