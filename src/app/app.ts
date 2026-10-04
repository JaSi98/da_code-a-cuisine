import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { LikeButton } from './shared/components/like-button/like-button';

@Component({
  imports: [RouterOutlet, LikeButton],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('code-a-cuisine');
  // Temporary preview state; removed after approval.
  protected readonly previewLiked = signal<boolean>(false);
}
