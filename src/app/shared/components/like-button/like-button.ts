import { Component, computed, input, output } from '@angular/core';

const ICON_PATH = 'assets/icons/';
const ICON_SYMBOL_ID = '#icon';

@Component({
  selector: 'app-like-button',
  styleUrl: './like-button.scss',
  templateUrl: './like-button.html',
})
export class LikeButton {
  readonly isLiked = input<boolean>(false);
  readonly ariaLabel = input<string>('Like recipe');
  readonly isDisabled = input<boolean>(false);

  readonly likeToggle = output<void>();

  protected readonly iconHref = computed<string>(() => this.getIconHref());

  /** Tells the parent that the user wants to like or unlike; the parent owns the liked state. */
  protected emitToggle(): void {
    this.likeToggle.emit();
  }

  /** Returns the filled heart for liked recipes, otherwise the outlined one. */
  private getIconHref(): string {
    const file = this.isLiked() ? 'heart-filled.svg' : 'heart.svg';
    return ICON_PATH + file + ICON_SYMBOL_ID;
  }
}
