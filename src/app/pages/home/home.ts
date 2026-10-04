import { Component } from '@angular/core';

import { Button } from '../../shared/components/button/button';
import { SiteHeader } from '../../shared/components/site-header/site-header';

@Component({
  selector: 'app-home',
  imports: [Button, SiteHeader],
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {}
