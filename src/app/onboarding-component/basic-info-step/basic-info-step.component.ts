import { Component, inject, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormUtilsService } from '../form-utils.service';

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

  // Injecting shared service for reusable form control logic
  private formUtils = inject(FormUtilsService);

  maxDate: Date = new Date(); // today

  /**
   * Checks if a given form control path has a specific validation error.
   * Used in the template to show error messages.
   */
  getError(controlName: string): string | null {
    return this.formUtils.getError(this.form, controlName);
  }
}
