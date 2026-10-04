import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CookbookRecipeItem } from './shared/components/cookbook-recipe-item/cookbook-recipe-item';

@Component({
  imports: [RouterOutlet, CookbookRecipeItem],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('code-a-cuisine');
  // Temporary preview data; removed after approval.
  protected readonly previewRecipes = [
    {
      position: 1,
      title: 'Pasta with spinach and cherry tomatoes',
      cookingTime: 20,
      tags: ['Vegetarian', 'Quick'],
      likes: 66,
    },
    { position: 2, title: 'Spinach omelette', cookingTime: 15, tags: ['Quick'], likes: 8 },
    {
      position: 3,
      title: 'Creamy tomato soup with fresh basil, garlic croutons and a swirl of cream',
      cookingTime: 35,
      tags: ['Vegetarian', 'Gluten-free'],
      likes: 1204,
    },
  ];
}
