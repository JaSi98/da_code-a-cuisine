import { Component, computed, input } from '@angular/core';

import { Button } from '../button/button';

@Component({
  selector: 'app-recipe-card',
  imports: [Button],
  styleUrl: './recipe-card.scss',
  templateUrl: './recipe-card.html',
})
export class RecipeCard {
  readonly position = input.required<number>();
  readonly title = input.required<string>();
  readonly cookingTime = input.required<number>();
  readonly link = input.required<string>();

  protected readonly viewLabel = computed<string>(() => `View recipe: ${this.title()}`);
}
