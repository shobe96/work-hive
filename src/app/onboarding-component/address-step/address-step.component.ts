import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ERROR_MESSAGES } from '../form-error-messages';
import { COUNTRIES, CITIES_BY_COUNTRY } from './citiesbycountry';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

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
})
export class AddressStepComponent implements OnInit {
  @Input() form!: FormGroup;

  countries = COUNTRIES;
  allCities = CITIES_BY_COUNTRY;
  filteredCities: { code: string; name: string }[] = [];

  ngOnInit() {
    // Initialize filtered cities if country is already selected
    const country = this.form.get('country')?.value;
    this.filterCities(country);

    // Listen for country changes to update cities list
    this.form.get('country')?.valueChanges.subscribe((countryCode) => {
      this.form.get('city')?.setValue(''); // reset city selection on country change
      this.filterCities(countryCode);
    });
  }

  filterCities(countryCode: string) {
    this.filteredCities = this.allCities[countryCode] || [];
  }

  getError(controlName: string): string | null {
    const control = this.form.get(controlName);
    if (!control || !(control.touched || control.dirty) || !control.errors) {
      return null;
    }

    const controlErrors = control.errors;
    const messages = ERROR_MESSAGES[controlName];

    for (const errorKey in controlErrors) {
      if (messages && messages[errorKey]) {
        return messages[errorKey];
      }
    }

    // Handle the custom cityCountryMismatch error
    if (controlName === 'city' && controlErrors['cityCountryMismatch']) {
      return 'Selected city does not belong to the selected country.';
    }

    if (controlErrors['required']) {
      return '*required';
    }

    return null;
  }
}
