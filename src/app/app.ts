import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeroBanner } from './shared/components/hero-banner/hero-banner';

@Component({
  imports: [RouterOutlet, HeroBanner],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('code-a-cuisine');
  // Temporary preview data; removed after approval.
  protected readonly previewSections = [
    { title: 'Ingredients', file: 'ingredients' },
    { title: 'Directions', file: 'directions' },
  ];
  protected readonly previewCuisines = [
    { title: 'Italian cuisine', file: 'italian', format: 'webp' },
    { title: 'German cuisine', file: 'german', format: 'webp' },
    { title: 'Japanese cuisine', file: 'japanese', format: 'webp' },
    { title: 'Gourmet cuisine', file: 'gourmet', format: 'webp' },
    { title: 'Indian cuisine', file: 'indian', format: 'webp' },
    { title: 'Fusion cuisine', file: 'fusion', format: 'webp' },
    { title: 'Arabic cuisine', file: 'arabic', format: 'svg' },
  ];
}
