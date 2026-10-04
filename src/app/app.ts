import { Component, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

import { Input } from './shared/components/input/input';

@Component({
  imports: [RouterOutlet, ReactiveFormsModule, Input],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('code-a-cuisine');
  // Temporary preview state; removed after approval.
  protected readonly previewName = new FormControl('', { nonNullable: true });
  protected readonly previewAmount = new FormControl('', { nonNullable: true });
  protected readonly previewNameValue = toSignal(this.previewName.valueChanges, {
    initialValue: '',
  });
  protected readonly previewAmountValue = toSignal(this.previewAmount.valueChanges, {
    initialValue: '',
  });
}
