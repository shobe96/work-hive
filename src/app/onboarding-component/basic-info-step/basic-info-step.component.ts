import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ERROR_MESSAGES } from '../form-error-messages';

@Component({
  standalone: true,
  selector: 'app-basic-info-step',
  templateUrl: './basic-info-step.component.html',
  styleUrls: ['./basic-info-step.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
})
export class BasicInfoStepComponent {
  @Input() form!: FormGroup;

  maxDate: Date = new Date(); // today

  /**
   * Checks if a specific form control has a given validation error.
   * Used in the HTML template to show error messages.
   * Returns the first relevant error message for a control, or null if none.
   */
  getError(controlName: string): string | null {
    const control = this.form.get(controlName);
    if (!control || !(control.touched || control.dirty) || !control.errors)
      return null;

    const controlErrors = control.errors;
    const messages = ERROR_MESSAGES[controlName];

    for (const errorKey in controlErrors) {
      if (messages && messages[errorKey]) {
        return messages[errorKey];
      }
    }

    return null;
  }
}
