import { Component, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

import { UnitSelect } from './shared/components/unit-select/unit-select';

@Component({
  imports: [RouterOutlet, ReactiveFormsModule, UnitSelect],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('code-a-cuisine');
  // Temporary preview state; removed after approval.
  protected readonly previewUnits = ['gram', 'piece', 'ml'];
  protected readonly previewUnit = new FormControl('gram', { nonNullable: true });
  protected readonly previewUnitValue = toSignal(this.previewUnit.valueChanges, {
    initialValue: this.previewUnit.value,
  });
}
