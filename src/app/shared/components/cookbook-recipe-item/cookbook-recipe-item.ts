import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Tag } from '../tag/tag';

@Component({
  selector: 'app-cookbook-recipe-item',
  imports: [RouterLink, Tag],
  styleUrl: './cookbook-recipe-item.scss',
  templateUrl: './cookbook-recipe-item.html',
})
export class CookbookRecipeItem {
  readonly position = input.required<number>();
  readonly title = input.required<string>();
  readonly cookingTime = input.required<number>();
  readonly tags = input<string[]>([]);
  readonly likes = input.required<number>();
  readonly link = input.required<string>();
}
