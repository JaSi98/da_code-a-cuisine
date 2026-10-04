import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ChefNumber } from './shared/components/cook-label/cook-label';
import { DirectionStep } from './shared/components/direction-step/direction-step';

@Component({
  imports: [RouterOutlet, DirectionStep],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('code-a-cuisine');
  // Temporary preview data; removed after approval.
  protected readonly previewSteps: {
    number: string;
    title: string;
    description: string;
    chef: ChefNumber;
  }[] = [
    {
      number: '1',
      title: 'Cook the pasta',
      description:
        'Cook your noodles in boiling, salted water, until the pasta is al dente.\nDrain the pasta and reserve some of the pasta water.',
      chef: 1,
    },
    {
      number: '2a',
      title: 'Make the sauce',
      description:
        'While the pasta is cooking, heat olive oil in a pan over medium heat. Add the garlic and sauté until it starts to turn golden.',
      chef: 2,
    },
    {
      number: '2b',
      title: 'Wash the spinach and halve the cherry tomatoes',
      description: 'Rinse the spinach, let it drain and cut the tomatoes in half.',
      chef: 3,
    },
  ];
}
