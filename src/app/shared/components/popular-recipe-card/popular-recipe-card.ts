import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LikeCount } from '../like-count/like-count';

@Component({
  selector: 'app-popular-recipe-card',
  imports: [LikeCount, RouterLink],
  styleUrl: './popular-recipe-card.scss',
  templateUrl: './popular-recipe-card.html',
})
export class PopularRecipeCard {
  readonly title = input.required<string>();
  readonly cookingTime = input.required<number>();
  readonly likes = input.required<number>();
  readonly link = input.required<string>();
}
