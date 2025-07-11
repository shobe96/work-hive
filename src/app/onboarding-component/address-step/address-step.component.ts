import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { COUNTRIES, CITIES_BY_COUNTRY } from './citiesbycountry';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormUtilsService } from '../form-utils.service';
import { Subscription } from 'rxjs';

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
export class AddressStepComponent implements OnInit, OnDestroy {
  @Input() form!: FormGroup;

  private formUtils = inject(FormUtilsService);

  countries = COUNTRIES;
  allCities = CITIES_BY_COUNTRY;
  filteredCities: { code: string; name: string }[] = [];

  private subscriptions: Subscription[] = [];

  ngOnInit() {
    this.initializeFilteredCities();
    this.subscribeToCountryChanges();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  private initializeFilteredCities() {
    const country = this.form.get('country')?.value;
    this.filterCities(country);
  }

  private subscribeToCountryChanges() {
    const countryControl = this.form.get('country');
    if (!countryControl) return;

    const countrySub = countryControl.valueChanges.subscribe((countryCode) => {
      this.form.get('city')?.setValue('');
      this.filterCities(countryCode);
    });
    this.subscriptions.push(countrySub);
  }

  filterCities(countryCode: string) {
    this.filteredCities = this.allCities[countryCode] || [];
  }

  getError(controlName: string): string | null {
    return this.formUtils.getError(this.form, controlName);
  }

  trackById(index: number, item: { code: string; name: string }): string {
    return item.code;
  }
}
