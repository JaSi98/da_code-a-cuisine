import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Pagination } from './shared/components/pagination/pagination';

@Component({
  imports: [RouterOutlet, Pagination],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('code-a-cuisine');
  // Temporary preview state; removed after approval.
  protected readonly previewPage = signal<number>(1);
}
