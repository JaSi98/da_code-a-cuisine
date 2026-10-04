import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ChefNumber, CookLabel } from './shared/components/cook-label/cook-label';

@Component({
  imports: [RouterOutlet, CookLabel],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('code-a-cuisine');
  // Temporary preview state; removed after approval.
  protected readonly previewChefs: ChefNumber[] = [1, 2, 3, 4];
}
