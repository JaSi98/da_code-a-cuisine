import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { IngredientInput } from './shared/components/ingredient-input/ingredient-input';
import { IngredientEntry } from './shared/models/ingredient-entry';

@Component({
  imports: [RouterOutlet, IngredientInput],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('code-a-cuisine');
  // Temporary preview state; removed after approval.
  protected readonly previewSuggestions = [
    'Pasta',
    'Pastrami',
    'Passion fruit',
    'Tomato',
    'Tofu',
    'Cheese',
    'Chicken',
    'Chickpeas',
    'Chili',
    'Chives',
    'Chocolate',
  ];
  protected readonly previewAdded = signal<IngredientEntry[]>([]);
}
