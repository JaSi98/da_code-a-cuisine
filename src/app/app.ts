import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Button } from './shared/components/button/button';
import { ErrorDialog } from './shared/components/error-dialog/error-dialog';

@Component({
  imports: [RouterOutlet, Button, ErrorDialog],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('code-a-cuisine');
  // Temporary preview state; removed after approval.
  protected readonly isPreviewDialogOpen = signal<boolean>(false);
}
