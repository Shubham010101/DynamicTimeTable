import { Component } from '@angular/core';
import { TimeTableFormComponent } from './components/time-table-form/time-table-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TimeTableFormComponent],
  template: `
    <app-time-table-form></app-time-table-form>
  `,
})
export class AppComponent {}
