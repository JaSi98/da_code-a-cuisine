import { Component, computed, input } from '@angular/core';

export type ChefNumber = 1 | 2 | 3 | 4;

/** Intrinsic image sizes in CSS pixels, so the label keeps its size while the image loads. */
const CHEF_IMAGE_WIDTHS: Record<ChefNumber, number> = { 1: 27.5, 2: 25, 3: 22, 4: 15 };
const CHEF_IMAGE_HEIGHT = 22;

@Component({
  selector: 'app-cook-label',
  styleUrl: './cook-label.scss',
  templateUrl: './cook-label.html',
})
export class CookLabel {
  readonly chef = input.required<ChefNumber>();

  protected readonly imageHeight = CHEF_IMAGE_HEIGHT;
  protected readonly imageWidth = computed<number>(() => CHEF_IMAGE_WIDTHS[this.chef()]);
  protected readonly imageSource = computed<string>(
    () => `assets/cook-labels/chef-${this.chef()}.png`,
  );
}
