import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CuisineCard } from './shared/components/cuisine-card/cuisine-card';

@Component({
  imports: [RouterOutlet, CuisineCard],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('code-a-cuisine');
}
