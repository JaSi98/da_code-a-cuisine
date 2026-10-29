import { Component } from '@angular/core';

import { SiteHeader } from '../../shared/components/site-header/site-header';

/** Shares the layout of the legal notice, so both legal pages look the same. */
@Component({
  selector: 'app-privacy-policy',
  imports: [SiteHeader],
  styleUrl: '../imprint/imprint.scss',
  templateUrl: './privacy-policy.html',
})
export class PrivacyPolicy {}
