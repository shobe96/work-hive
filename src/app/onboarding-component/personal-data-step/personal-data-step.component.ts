import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormUtilsService } from '../form-utils.service';

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

  // Injecting shared service for reusable form control logic
  private formUtils = inject(FormUtilsService);

  tshirtSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  /**
   * Checks if a given form control path has a specific validation error.
   * Used in the template to show error messages.
   */
  getError(controlName: string): string | null {
    return this.formUtils.getError(this.form, controlName);
  }
}
