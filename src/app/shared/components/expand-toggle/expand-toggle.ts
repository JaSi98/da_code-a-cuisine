import { Component, computed, input, model } from '@angular/core';

@Component({
  selector: 'app-expand-toggle',
  styleUrl: './expand-toggle.scss',
  templateUrl: './expand-toggle.html',
})
export class ExpandToggle {
  readonly isExpanded = model<boolean>(false);
  readonly collapsedLabel = input<string>('See all');
  readonly expandedLabel = input<string>('See less');
  readonly controlsId = input<string | null>(null);

  protected readonly label = computed<string>(() =>
    this.isExpanded() ? this.expandedLabel() : this.collapsedLabel(),
  );

  /** Shows or hides the content that this toggle controls. */
  protected toggle(): void {
    this.isExpanded.update((isExpanded) => !isExpanded);
  }
}
