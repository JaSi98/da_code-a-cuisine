import { Component, computed, effect, input, signal } from '@angular/core';

import { ChefNumber, RecipeStep } from '../../models/recipe-step';
import { DirectionStep } from '../direction-step/direction-step';
import { Tag } from '../tag/tag';

const STORAGE_PREFIX = 'direction-list:';

@Component({
  selector: 'app-direction-list',
  imports: [DirectionStep, Tag],
  styleUrl: './direction-list.scss',
  templateUrl: './direction-list.html',
})
export class DirectionList {
  readonly steps = input.required<RecipeStep[]>();
  /** Keeps the ticked steps in this browser, e.g. per recipe id; without it nothing is stored. */
  readonly storageKey = input<string | null>(null);

  protected readonly selectedChef = signal<ChefNumber | null>(null);
  protected readonly doneSteps = signal<ReadonlySet<string>>(new Set());
  protected readonly chefs = computed<ChefNumber[]>(() =>
    [...new Set(this.steps().map((step) => step.chef))].sort(),
  );
  protected readonly visibleSteps = computed<RecipeStep[]>(() => {
    const chef = this.selectedChef();
    return chef === null ? this.steps() : this.steps().filter((step) => step.chef === chef);
  });
  protected readonly doneCount = computed<number>(
    () => this.visibleSteps().filter((step) => this.doneSteps().has(step.number)).length,
  );

  constructor() {
    effect(() => this.doneSteps.set(this.readDoneSteps(this.storageKey())));
  }

  /** Shows only the steps of one cook, or all steps for null. */
  protected selectChef(chef: ChefNumber | null): void {
    this.selectedChef.set(chef);
  }

  /** Ticks a step or opens it again, and remembers the change. */
  protected setDone(stepNumber: string, isDone: boolean): void {
    const doneSteps = new Set(this.doneSteps());
    if (isDone) {
      doneSteps.add(stepNumber);
    } else {
      doneSteps.delete(stepNumber);
    }
    this.doneSteps.set(doneSteps);
    this.writeDoneSteps(doneSteps);
  }

  /** Reads the ticked steps; storage may be blocked, then the list starts empty. */
  private readDoneSteps(key: string | null): ReadonlySet<string> {
    try {
      const stored = key ? localStorage.getItem(STORAGE_PREFIX + key) : null;
      return new Set<string>(stored ? JSON.parse(stored) : []);
    } catch {
      return new Set();
    }
  }

  /** Stores the ticked steps; a blocked storage only means the ticks are not kept. */
  private writeDoneSteps(doneSteps: ReadonlySet<string>): void {
    const key = this.storageKey();
    try {
      if (key) {
        localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify([...doneSteps]));
      }
    } catch {
      // Nothing to do: the list keeps working, it just forgets the ticks on reload.
    }
  }
}
