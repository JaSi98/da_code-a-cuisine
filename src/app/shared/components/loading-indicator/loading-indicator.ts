import { Component, input } from '@angular/core';

/** Display size of the animation in CSS pixels; the image files have about twice the resolution. */
const LOADER_WIDTH = 243;
const LOADER_HEIGHT = 273;
// Shows a still image instead of the animation when the user prefers less motion.
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

@Component({
  selector: 'app-loading-indicator',
  styleUrl: './loading-indicator.scss',
  templateUrl: './loading-indicator.html',
})
export class LoadingIndicator {
  readonly label = input<string>('Generating ...');

  protected readonly width = LOADER_WIDTH;
  protected readonly height = LOADER_HEIGHT;
  protected readonly reducedMotionQuery = REDUCED_MOTION_QUERY;
}
