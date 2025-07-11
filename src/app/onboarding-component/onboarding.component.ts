import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';

import { AddressStepComponent } from './address-step/address-step.component';
import { BasicInfoStepComponent } from './basic-info-step/basic-info-step.component';
import { PersonalDataStepComponent } from './personal-data-step/personal-data-step.component';
import { SummaryStepComponent } from './summary-step/summary-step.component';
import { TechStackStepComponent } from './tech-stack-step/tech-stack-step.component';
import { OnboardingSteps } from './step-labels.enum';

import {
  phoneNumberValidator,
  nonEmptyArrayValidator,
  urlValidator,
  cityCountryValidator,
} from './validators';
import { CITIES_BY_COUNTRY } from './address-step/citiesbycountry';

@Component({
  selector: 'app-onboarding-component',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatStepperModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatTableModule,
    BasicInfoStepComponent,
    AddressStepComponent,
    PersonalDataStepComponent,
    TechStackStepComponent,
    SummaryStepComponent,
  ],
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.scss',
})
export class OnboardingComponent {
  form: FormGroup;
  public OnboardingSteps = OnboardingSteps;

  @ViewChild('stepper') stepper!: MatStepper;

  summaryData: { label: string; value: string }[] = [];

  private fb = inject(FormBuilder);

  constructor() {
    this.form = this.buildForm();
  }

  private buildForm(): FormGroup {
    return this.fb.group({
      step1: this.buildStep1Form(),
      step2: this.buildStep2Form(),
      step3: this.buildStep3Form(),
      step4: this.buildStep4Form(),
    });
  }

  private buildStep1Form(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      dob: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [
        '',
        [Validators.required, Validators.minLength(8), phoneNumberValidator()],
      ],
      emergencyPhone: [
        '',
        [Validators.required, Validators.minLength(8), phoneNumberValidator()],
      ],
    });
  }

  private buildStep2Form(): FormGroup {
    return this.fb.group(
      {
        address: ['', Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required],
      },
      {
        validators: cityCountryValidator(CITIES_BY_COUNTRY),
      }
    );
  }

  private buildStep3Form(): FormGroup {
    return this.fb.group({
      tshirt: ['', Validators.required],
      allergies: [''],
      bloodType: ['', Validators.required],
      hobbies: [''],
      linkedin: ['', urlValidator()],
      github: ['', urlValidator()],
    });
  }

  private buildStep4Form(): FormGroup {
    return this.fb.group({
      role: ['', Validators.required],
      frontend: this.fb.group({
        languages: [[], nonEmptyArrayValidator()],
        frameworks: [[], nonEmptyArrayValidator()],
      }),
      backend: this.fb.group({
        languages: [[], nonEmptyArrayValidator()],
        frameworks: [[], nonEmptyArrayValidator()],
      }),
    });
  }

  isStepInvalid(index: number): boolean {
    const stepForms = [
      this.step1Form,
      this.step2Form,
      this.step3Form,
      this.step4Form,
    ];
    const currentStep = stepForms[index];
    // Just check validity without marking touched
    return currentStep.invalid;
  }

  markStepTouched(index: number) {
    const stepForms = [
      this.step1Form,
      this.step2Form,
      this.step3Form,
      this.step4Form,
    ];
    stepForms[index].markAllAsTouched();
  }

  goToNextStep() {
    const currentIndex = this.stepper.selectedIndex;
    if (this.isStepInvalid(currentIndex)) {
      this.markStepTouched(currentIndex);
      return; // prevent moving to next step if invalid
    }
    if (currentIndex < this.stepper.steps.length - 1) {
      this.stepper.next();
    }
  }

  goToPreviousStep() {
    const currentIndex = this.stepper.selectedIndex;
    if (currentIndex > 0) {
      this.stepper.previous();
    }
  }

  onStepChange(event: { selectedIndex: number }) {
    if (event.selectedIndex === this.stepper.steps.length - 1) {
      this.prepareSummary();
    }
  }

  prepareSummary() {
    const value = this.form.value;
    const frontend = value.step4.frontend;
    const backend = value.step4.backend;

    this.summaryData = [
      { label: 'Name', value: value.step1.name },
      { label: 'Surname', value: value.step1.surname },
      {
        label: 'Date of Birth',
        value: new Date(value.step1.dob).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }),
      },
      { label: 'Email', value: value.step1.email },
      { label: 'Phone', value: value.step1.phone },
      { label: 'Emergency Phone', value: value.step1.emergencyPhone },
      { label: 'Address', value: value.step2.address },
      { label: 'City', value: value.step2.city },
      { label: 'Country', value: value.step2.country },
      { label: 'T-shirt Size', value: value.step3.tshirt },
      { label: 'Allergies', value: value.step3.allergies || 'None' },
      { label: 'Blood Type', value: value.step3.bloodType },
      { label: 'Hobbies', value: value.step3.hobbies || 'None' },
      { label: 'LinkedIn', value: value.step3.linkedin || 'N/A' },
      { label: 'GitHub', value: value.step3.github || 'N/A' },
      { label: 'Role', value: value.step4.role },
      {
        label: 'Frontend Languages',
        value:
          value.step4.role !== 'Backend'
            ? (frontend.languages || []).join(', ') || 'None'
            : 'N/A',
      },
      {
        label: 'Frontend Frameworks',
        value:
          value.step4.role !== 'Backend'
            ? (frontend.frameworks || []).join(', ') || 'None'
            : 'N/A',
      },
      {
        label: 'Backend Languages',
        value:
          value.step4.role !== 'Frontend'
            ? (backend.languages || []).join(', ') || 'None'
            : 'N/A',
      },
      {
        label: 'Backend Frameworks',
        value:
          value.step4.role !== 'Frontend'
            ? (backend.frameworks || []).join(', ') || 'None'
            : 'N/A',
      },
    ];
  }

  get step1Form(): FormGroup {
    return this.form.get('step1') as FormGroup;
  }

  get step2Form(): FormGroup {
    return this.form.get('step2') as FormGroup;
  }

  get step3Form(): FormGroup {
    return this.form.get('step3') as FormGroup;
  }

  get step4Form(): FormGroup {
    return this.form.get('step4') as FormGroup;
  }

  get isLastStep(): boolean {
    return (
      this.stepper?.selectedIndex === (this.stepper?.steps?.length ?? 0) - 1
    );
  }

  finish() {
    // Implement navigation or form submission logic here
  }
}
