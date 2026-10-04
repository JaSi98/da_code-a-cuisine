import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { DirectionList } from './shared/components/direction-list/direction-list';
import { RecipeStep } from './shared/models/recipe-step';

@Component({
  imports: [RouterOutlet, DirectionList],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('code-a-cuisine');
  // Temporary preview data; removed after approval.
  protected readonly previewSteps: RecipeStep[] = [
    {
      number: '1',
      title: 'Cook the pasta',
      description:
        'Cook your noodles in boiling, salted water, until the pasta is al dente.\nDrain the pasta and reserve some of the pasta water.',
      chef: 1,
    },
    {
      number: '2',
      title: 'Make the sauce',
      description:
        'While the pasta is cooking, heat olive oil in a pan over medium heat. Add the garlic, and sauté until it starts to turn golden.',
      chef: 2,
    },
    {
      number: '3a',
      title: 'Finish the pasta',
      description:
        'Add the noodles to the sauce, then add pasta water until the sauce is the right consistency.',
      chef: 1,
    },
    {
      number: '3b',
      title: 'Make the sauce',
      description: 'Lower the heat to low, stir until mixed, and remove from the heat.',
      chef: 2,
    },
  ];
}
