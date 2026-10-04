import { Component, input } from '@angular/core';

@Component({
  selector: 'app-like-count',
  styleUrl: './like-count.scss',
  templateUrl: './like-count.html',
})
export class LikeCount {
  readonly count = input.required<number>();
}
