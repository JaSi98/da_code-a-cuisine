import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Button } from './shared/components/button/button';
import { SiteHeader } from './shared/components/site-header/site-header';

@Component({
  imports: [RouterOutlet, Button, SiteHeader],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('code-a-cuisine');
}
