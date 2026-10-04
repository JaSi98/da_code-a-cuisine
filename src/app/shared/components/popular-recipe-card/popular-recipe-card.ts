import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-popular-recipe-card',
  imports: [RouterLink],
  styleUrl: './popular-recipe-card.scss',
  templateUrl: './popular-recipe-card.html',
})
export class PopularRecipeCard {
  readonly title = input.required<string>();
  readonly cookingTime = input.required<number>();
  readonly likes = input.required<number>();
  readonly link = input.required<string>();
}
