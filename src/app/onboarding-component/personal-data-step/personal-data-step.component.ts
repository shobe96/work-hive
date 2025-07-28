import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  signal,
  Input,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormUtilsService } from '../form-utils.service';
import { STEP3_VALIDATORS } from '../step3-validator-config';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalDataStepComponent implements OnInit {
  // Input form group provided by the parent component (required)
  @Input({ required: true }) form!: FormGroup;

  // Injecting shared service for reusable form control logic
  private formUtils = inject(FormUtilsService);

  // Inject ChangeDetectorRef (not currently used, but may be needed for manual change detection)
  private cd = inject(ChangeDetectorRef);

  // ==== Static Form Options (Signals) ====

  // Available T-shirt sizes (e.g., for a dropdown)
  readonly tshirtSizes = signal(['XS', 'S', 'M', 'L', 'XL', 'XXL']);

  // Standard list of blood types
  readonly bloodTypes = signal([
    'A+',
    'A-',
    'B+',
    'B-',
    'AB+',
    'AB-',
    'O+',
    'O-',
  ]);

  ngOnInit(): void {
    // Apply step-specific custom validators to relevant controls
    this.formUtils.setCustomValidators(this.form, STEP3_VALIDATORS);

    // Optional: mark all controls as touched/dirty to force validation display immediately
    // this.formUtils.markAsTouchedAndDirty(this.form);
  }

  /**
   * Returns a user-friendly error message for a given control name.
   * @param controlName - Name of the form control
   * @returns A validation error message or null if no error exists
   */
  getError(controlName: string): string | null {
    return this.formUtils.getError(this.form, controlName);
  }

  /**
   * TrackBy function for ngFor when rendering select/radio options.
   * Prevents unnecessary DOM re-renders.
   * @param index - Index of the item in the list
   * @param value - The string value (e.g., blood type or t-shirt size)
   * @returns The string value itself, used as a unique identifier
   */
  trackByValue(index: number, value: string): string {
    return value;
  }
}
