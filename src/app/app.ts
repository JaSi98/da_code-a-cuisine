import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ExpandToggle } from './shared/components/expand-toggle/expand-toggle';

@Component({
  imports: [RouterOutlet, ExpandToggle],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('code-a-cuisine');
  // Temporary preview state; removed after approval.
  protected readonly previewExpanded = signal<boolean>(false);
}
