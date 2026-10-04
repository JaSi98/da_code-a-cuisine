import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export type SiteHeaderVariant = 'green' | 'cream';

const LOGO_PATH = 'assets/logo/';

@Component({
  selector: 'app-site-header',
  imports: [RouterLink],
  styleUrl: './site-header.scss',
  templateUrl: './site-header.html',
})
export class SiteHeader {
  readonly variant = input<SiteHeaderVariant>('green');
  readonly backLink = input<string | null>(null);
  readonly backLabel = input<string>('Back');

  protected readonly logoSource = computed<string>(() => `${LOGO_PATH}logo-${this.variant()}.svg`);
}
