import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Intrinsic image size in CSS pixels, so the card keeps its height while the image loads. */
const CUISINE_IMAGE_SIZE = 400;

@Component({
  selector: 'app-cuisine-card',
  imports: [RouterLink],
  styleUrl: './cuisine-card.scss',
  templateUrl: './cuisine-card.html',
})
export class CuisineCard {
  readonly name = input.required<string>();
  readonly emoji = input.required<string>();
  readonly image = input.required<string>();
  readonly link = input.required<string>();

  protected readonly imageSize = CUISINE_IMAGE_SIZE;
}
