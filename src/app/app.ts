import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { PopularRecipeCard } from './shared/components/popular-recipe-card/popular-recipe-card';

@Component({
  imports: [RouterOutlet, PopularRecipeCard],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('code-a-cuisine');
  // Temporary preview data; removed after approval.
  protected readonly previewRecipes = [
    { title: 'Pasta with spinach and cherry tomatoes', cookingTime: 20, likes: 66 },
    { title: 'Spinach omelette', cookingTime: 15, likes: 8 },
    { title: 'Creamy tomato soup with fresh basil and croutons', cookingTime: 35, likes: 1204 },
  ];
}
