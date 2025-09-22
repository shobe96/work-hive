import { Component, ViewChild, computed, signal, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { OnboardingSteps } from './step-labels.enum';
import { CITIES_BY_COUNTRY } from './address-step/citiesbycountry';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { AddressStepComponent } from './address-step/address-step.component';
import { BasicInfoStepComponent } from './basic-info-step/basic-info-step.component';
import { PersonalDataStepComponent } from './personal-data-step/personal-data-step.component';
import { SummaryStepComponent } from './summary-step/summary-step.component';
import { TechStackStepComponent } from './tech-stack-step/tech-stack-step.component';
import { FormUtilsService } from './form-utils.service';

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
  // Enum of all onboarding steps
  public OnboardingSteps = OnboardingSteps;

  // Reference to the Material stepper component in the template
  @ViewChild('stepper') stepper!: MatStepper;

  // Dependency injection for FormBuilder and FormUtilsService
  private fb = inject(FormBuilder);
  private formUtils = inject(FormUtilsService); // Inject FormUtilsService

  // ==== Signals ====

  // Stores the summary data to display at the final ste
  readonly summaryData = signal<{ label: string; value: string }[]>([]);

  // Tracks the currently selected step index
  readonly selectedIndex = signal(0);

  // Builds the complete onboarding form (containing 4 steps)
  readonly form = this.buildForm();

  // Step Forms (computed from main form)
  readonly stepForms = computed((): FormGroup[] => [
    this.step1Form,
    this.step2Form,
    this.step3Form,
    this.step4Form,
  ]);

  // Computed value indicating whether the user is on the last step
  readonly isLastStep = computed(() => {
    const stepper = this.stepper;
    return stepper ? this.selectedIndex() === stepper.steps.length - 1 : false;
  });

  // ==== Form Getters ====

  // Getter for Step 1 form (Basic Info)
  get step1Form(): FormGroup {
    return this.form.get('step1') as FormGroup;
  }

  // Getter for Step 2 form (Address Info)
  get step2Form(): FormGroup {
    return this.form.get('step2') as FormGroup;
  }

  // Getter for Step 3 form (Personal Info)
  get step3Form(): FormGroup {
    return this.form.get('step3') as FormGroup;
  }

  // Getter for Step 4 form (Tech Stack)
  get step4Form(): FormGroup {
    return this.form.get('step4') as FormGroup;
  }

  // ==== Form Builders ====

  // Builds the full form group with nested step forms
  private buildForm(): FormGroup {
    return this.fb.group({
      step1: this.buildStep1Form(),
      step2: this.buildStep2Form(),
      step3: this.buildStep3Form(),
      step4: this.buildStep4Form(),
    });
  }

  /**
   * Builds the form for Step 1 (Basic Info).
   * Validators are set inside BasicInfoStepComponent via FormUtilsService.
   */
  private buildStep1Form(): FormGroup {
    return this.fb.group({
      name: [''],
      surname: [''],
      dob: [''],
      email: [''],
      phone: [''],
      emergencyPhone: [''],
    });
  }

  /**
   * Builds the form for Step 2 (Address Data).
   * Validators are set inside AddressStepComponent via FormUtilsService.
   */
  private buildStep2Form(): FormGroup {
    const form = this.fb.group({
      address: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
    });
    this.formUtils.setAddressValidators(form, CITIES_BY_COUNTRY);
    return form;
  }

  /**
   * Builds the form for Step 3 (Personal Data).
   * Validators are set inside PersonalDataStepComponent via FormUtilsService.
   */
  private buildStep3Form(): FormGroup {
    return this.fb.group({
      tshirt: [''], // No validators here
      allergies: [''],
      bloodType: [''],
      hobbies: [''],
      linkedin: [''],
      github: [''],
    });
  }

  /**
   * Builds the form for Step 4 (Tech Stack Data).
   * Validators are set inside TechStackStepComponent via FormUtilsService.
   */
  private buildStep4Form(): FormGroup {
    return this.fb.group({
      role: ['', Validators.required],
      frontend: this.fb.group({
        languages: [[]], // No validators here; FormUtilsService handles dynamically
        frameworks: [[]],
      }),
      backend: this.fb.group({
        languages: [[]],
        frameworks: [[]],
      }),
    });
  }

  // ==== Step Handling ====

  /**
   * Handles step change events from the stepper component.
   * Marks previous form dirty if it's invalid and prepares summary on last step.
   */
  onStepChange(event: {
    selectedIndex: number;
    previouslySelectedIndex?: number;
  }) {
    const prev = event.previouslySelectedIndex;
    const next = event.selectedIndex;
    this.selectedIndex.set(next);

    const prevForm = typeof prev === 'number' ? this.stepForms()[prev] : null;

    // Only mark previous step dirty if it's invalid (i.e., user skipped validation)
    if (prevForm && prevForm.invalid) {
      this.formUtils.markAsTouchedAndDirty(prevForm);
    }

    // Don't mark the new step dirty — let Angular track it based on user input

    // Prepare summary if user navigates to the last step
    if (next === this.stepper.steps.length - 1) {
      this.prepareSummary();
    }
  }

  /**
   * Checks if a given step index corresponds to an invalid form.
   */
  isStepInvalid(index: number): boolean {
    const form = this.stepForms()[index];
    return !!form && form.invalid;
  }

  /**
   * Collects all form values and prepares summary data for display in the final step.
   */
  prepareSummary() {
    const value = this.form.value;
    const frontend = value.step4.frontend;
    const backend = value.step4.backend;

    this.summaryData.set([
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
    ]);
  }

  /**
   * Final submission logic (to be implemented).
   */
  finish() {
    // Final submission logic
  }
}
