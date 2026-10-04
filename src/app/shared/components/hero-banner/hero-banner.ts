import { Component, input } from '@angular/core';

/** 'section' heads a part of a page, 'cuisine' is the title of a cuisine page. */
export type HeroBannerVariant = 'section' | 'cuisine';

/** Matches the mobile breakpoint of the styles, so the mobile image is loaded on the same screens. */
const MOBILE_MEDIA_QUERY = '(max-width: 768px)';

@Component({
  selector: 'app-hero-banner',
  styleUrl: './hero-banner.scss',
  templateUrl: './hero-banner.html',
})
export class HeroBanner {
  readonly title = input.required<string>();
  readonly image = input.required<string>();
  readonly imageMobile = input.required<string>();
  readonly variant = input<HeroBannerVariant>('section');

  protected readonly mobileMediaQuery = MOBILE_MEDIA_QUERY;
}
