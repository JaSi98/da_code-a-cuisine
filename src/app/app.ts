import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { LoadingIndicator } from './shared/components/loading-indicator/loading-indicator';

@Component({
  imports: [RouterOutlet, LoadingIndicator],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('code-a-cuisine');
}
