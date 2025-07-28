import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormUtilsService } from '../form-utils.service';
import { STEP1_VALIDATORS } from '../step1-validator-config';
import { debounceTime } from 'rxjs';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicInfoStepComponent implements OnInit {
  // Input FormGroup passed from parent component (required)
  @Input({ required: true }) form!: FormGroup;

  // Injects a utility service to handle form-related logic like validation
  private readonly formUtils = inject(FormUtilsService);

  // ==== Signals ====

  // Maximum allowed date for date pickers (e.g., date of birth should not be in the future)
  readonly maxDate = new Date();

  // Signal for real-time form values (optional, useful for debugging or computed logic)
  readonly formValues = computed(() => this.form?.value);

  ngOnInit(): void {
    // Apply custom validators for Step 1 controls (name, email, etc.)
    this.formUtils.setCustomValidators(this.form, STEP1_VALIDATORS);

    // Ensure validation is triggered on component init
    // this.formUtils.markAsTouchedAndDirty(this.form);

    // Listen to form changes with debounce to reduce noise from rapid typing/input
    this.form.valueChanges
      .pipe(debounceTime(300)) // avoid rapid changes
      .subscribe(() => {
        // Optional: force revalidation manually
        // Not recommended unless you explicitly need to retrigger validation for external reasons
        // this.form.updateValueAndValidity({ onlySelf: false, emitEvent: false }); <-- avoid this unless absolutely needed
      });
  }

  /**
   * Gets the validation error message for a specific form control.
   * @param controlName - Name of the form control to check for errors
   * @returns A user-friendly error message or null if no error exists
   */
  getError(controlName: string): string | null {
    return this.formUtils.getError(this.form, controlName);
  }
}
