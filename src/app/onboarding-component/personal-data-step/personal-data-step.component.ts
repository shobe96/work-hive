import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ERROR_MESSAGES } from '../form-error-messages';

@Component({
  selector: 'app-personal-data-step',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
  ],
  templateUrl: './personal-data-step.component.html',
  styleUrl: './personal-data-step.component.scss',
})
export class PersonalDataStepComponent {
  @Input() form!: FormGroup;

  tshirtSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

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
