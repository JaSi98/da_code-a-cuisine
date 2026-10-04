import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CookbookRecipeItem } from './shared/components/cookbook-recipe-item/cookbook-recipe-item';
import { LikeCount } from './shared/components/like-count/like-count';
import { PopularRecipeCard } from './shared/components/popular-recipe-card/popular-recipe-card';

@Component({
  imports: [RouterOutlet, CookbookRecipeItem, LikeCount, PopularRecipeCard],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('code-a-cuisine');
}
