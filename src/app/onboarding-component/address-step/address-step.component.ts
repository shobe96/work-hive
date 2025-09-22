import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Input,
  OnInit,
  Signal,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { COUNTRIES, CITIES_BY_COUNTRY } from './citiesbycountry';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormUtilsService } from '../form-utils.service';
import { STEP2_VALIDATORS } from '../step2-validator-config';

@Component({
  selector: 'app-address-step',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
  ],
  templateUrl: './address-step.component.html',
  styleUrl: './address-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressStepComponent implements OnInit {
  // Parent form group passed in from the onboarding component
  @Input({ required: true }) form!: FormGroup;

  // Utility service to apply custom validators and retrieve form errors
  private formUtils = inject(FormUtilsService);

  // ==== Static Data ====

  // List of available countries
  readonly countries = COUNTRIES;

  // Mapping of all cities by country code
  private readonly allCities = CITIES_BY_COUNTRY;

  // ==== Reactive State ====

  // Signal tracking currently selected country
  private readonly country = signal<string>('');

  // Computed signal: filters cities based on selected country
  readonly filteredCities: Signal<{ code: string; name: string }[]> = computed(
    () => {
      return this.allCities[this.country()] || [];
    }
  );

  ngOnInit() {
    // Apply field-level validators for Step 2 (address-related controls)
    this.formUtils.setCustomValidators(this.form, STEP2_VALIDATORS);

    // Optional: uncomment to immediately mark form as dirty and show validation errors
    // this.formUtils.markAsTouchedAndDirty(this.form);

    // Initialize country listener to update city options and reset city selection when country changes
    this.initCountryListener(); // Trigger validation UI
  }

  /**
   * Initializes a listener on the 'country' control to:
   * - Update the internal signal used for filtering cities
   * - Clear/reset the selected city when country changes
   */
  private initCountryListener(): void {
    const countryControl = this.form.get('country');
    if (!countryControl) return;

    // Set the initial country value into the signal
    this.country.set(countryControl.value);

    // Reactively update signal and reset 'city' control on country change
    countryControl.valueChanges.subscribe((countryCode: string) => {
      this.country.set(countryCode);
      this.form.get('city')?.setValue('');
    });
  }

  /**
   * Gets the validation error message for a specific control.
   * @param controlName - The name of the form control
   * @returns A user-friendly error string or null
   */
  getError(controlName: string): string | null {
    return this.formUtils.getError(this.form, controlName);
  }

  /**
   * TrackBy function for ngFor rendering of cities to optimize DOM updates.
   * @param index - The index of the item in the loop
   * @param item - The city item with `code` and `name`
   * @returns A unique identifier (city code)
   */
  trackById(index: number, item: { code: string; name: string }): string {
    return item.code;
  }
}
