import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { RecipeCard } from './shared/components/recipe-card/recipe-card';

@Component({
  imports: [RouterOutlet, RecipeCard],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('code-a-cuisine');
  // Temporary preview data; removed after approval.
  protected readonly previewRecipes = [
    { position: 1, title: 'Pasta with spinach and cherry tomatoes', cookingTime: 20 },
    { position: 2, title: 'Spinach omelette', cookingTime: 15 },
    { position: 3, title: 'Creamy tomato soup with fresh basil and croutons', cookingTime: 35 },
  ];
}
