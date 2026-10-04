import { Component, effect, ElementRef, input, model, viewChild } from '@angular/core';

import { Button } from '../button/button';

let nextErrorDialogId = 0;

@Component({
  selector: 'app-error-dialog',
  imports: [Button],
  styleUrl: './error-dialog.scss',
  templateUrl: './error-dialog.html',
})
export class ErrorDialog {
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  readonly isOpen = model<boolean>(false);
  readonly title = input.required<string>();
  readonly message = input.required<string>();
  readonly actionLabel = input.required<string>();
  readonly actionLink = input.required<string>();

  protected readonly titleId = `error-dialog-title-${nextErrorDialogId}`;
  protected readonly messageId = `error-dialog-message-${nextErrorDialogId++}`;

  constructor() {
    effect(() => this.syncDialog(this.isOpen()));
  }

  /** Closes the dialog through the open state, which the effect then applies to the element. */
  protected close(): void {
    this.isOpen.set(false);
  }

  /** Handles Escape through the open state instead of letting the browser close the dialog. */
  protected handleCancel(event: Event): void {
    event.preventDefault();
    this.close();
  }

  /** Keeps the open state in sync if the browser closes the dialog by itself. */
  protected handleClose(): void {
    this.isOpen.set(false);
  }

  /** Closes the dialog when the dimmed area around it is clicked. */
  protected closeOnBackdrop(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) {
      this.close();
    }
  }

  /** Opens the dialog as a modal or closes it, depending on the open state. */
  private syncDialog(isOpen: boolean): void {
    const dialog = this.dialog().nativeElement;
    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }
}
