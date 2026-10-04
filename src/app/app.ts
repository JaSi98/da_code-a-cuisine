import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Tag } from './shared/components/tag/tag';

@Component({
  imports: [RouterOutlet, Tag],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('code-a-cuisine');
  // Temporary preview state; removed after approval.
  protected readonly previewOptions = ['Quick', 'Medium', 'Complex'];
  protected readonly previewSelection = signal<string>('Quick');
}
