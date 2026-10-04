import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { IconButton } from './shared/components/icon-button/icon-button';

@Component({
  imports: [RouterOutlet, IconButton],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('code-a-cuisine');
}
