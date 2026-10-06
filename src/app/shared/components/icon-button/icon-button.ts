import { Component, computed, input, output } from '@angular/core';

export type IconButtonIcon =
  'edit' | 'delete' | 'add' | 'check' | 'plus' | 'minus' | 'back' | 'dice';
export type IconButtonType = 'button' | 'submit';

interface IconAsset {
  file: string;
  viewBox: string;
}

const ICON_BASE_PATH = 'assets/icons/';
const ICON_SYMBOL_ID = '#icon';
const MATERIAL_VIEW_BOX = '0 -960 960 960';
const ICON_ASSETS: Record<IconButtonIcon, IconAsset> = {
  edit: { file: 'edit.svg', viewBox: MATERIAL_VIEW_BOX },
  delete: { file: 'delete.svg', viewBox: MATERIAL_VIEW_BOX },
  add: { file: 'add.svg', viewBox: MATERIAL_VIEW_BOX },
  check: { file: 'check.svg', viewBox: MATERIAL_VIEW_BOX },
  plus: { file: 'plus-box.svg', viewBox: MATERIAL_VIEW_BOX },
  minus: { file: 'minus-box.svg', viewBox: MATERIAL_VIEW_BOX },
  back: { file: 'arrow-left.svg', viewBox: '0 0 20 14' },
  dice: { file: 'dice.svg', viewBox: MATERIAL_VIEW_BOX },
};

@Component({
  selector: 'app-icon-button',
  styleUrl: './icon-button.scss',
  templateUrl: './icon-button.html',
})
export class IconButton {
  readonly icon = input.required<IconButtonIcon>();
  readonly ariaLabel = input.required<string>();
  readonly type = input<IconButtonType>('button');
  readonly isDisabled = input<boolean>(false);
  readonly isOnDark = input<boolean>(false);

  readonly buttonClick = output<void>();

  protected readonly iconHref = computed<string>(
    () => ICON_BASE_PATH + ICON_ASSETS[this.icon()].file + ICON_SYMBOL_ID,
  );
  protected readonly viewBox = computed<string>(() => ICON_ASSETS[this.icon()].viewBox);

  /** Forwards the click to the parent component. */
  protected emitClick(): void {
    this.buttonClick.emit();
  }
}
