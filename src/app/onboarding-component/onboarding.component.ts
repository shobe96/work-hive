import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';

interface MyStepperSelectionEvent {
  selectedIndex: number;
  previouslySelectedIndex: number;
  // add other properties you expect, if needed
}

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
  ],
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.scss',
})
export class OnboardingComponent {
  form: FormGroup;

  tshirtSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  languageFrameworks: { [key: string]: string[] } = {
    JavaScript: ['Angular', 'React', 'Vue'],
    TypeScript: ['Angular', 'React'],
    Java: ['Spring', 'Struts'],
    Python: ['Django', 'Flask'],
    'Node.js': ['Express'],
  };

  backendLanguages = ['Node.js', 'Python', 'Java'];

  @ViewChild('stepper') stepper!: MatStepper;

  summaryData: { label: string; value: string }[] = [];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      step1: this.fb.group({
        name: ['', [Validators.required, Validators.minLength(3)]],
        surname: ['', [Validators.required, Validators.minLength(3)]],
        dob: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.minLength(8)]],
        emergencyPhone: ['', [Validators.required, Validators.minLength(8)]],
      }),
      step2: this.fb.group({
        address: ['', Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required],
      }),
      step3: this.fb.group({
        tshirt: ['', Validators.required],
        allergies: [''],
        bloodType: ['', Validators.required],
        hobbies: [''],
        linkedin: ['', Validators.pattern(/https?:\/\/.*/)],
        github: ['', Validators.pattern(/https?:\/\/.*/)],
      }),
      step4: this.fb.group({
        role: ['', Validators.required],
        frontend: this.fb.group({
          languages: [{ value: [], disabled: true }],
          frameworks: [{ value: [], disabled: true }],
        }),
        backend: this.fb.group({
          languages: [{ value: [], disabled: true }],
          frameworks: [{ value: [], disabled: true }],
        }),
      }),
    });
  }

  isStepInvalid(index: number): boolean {
    switch (index) {
      case 0:
        return this.step1Form.invalid;
      case 1:
        return this.step2Form.invalid;
      case 2:
        return this.step3Form.invalid;
      case 3:
        return this.step4Form.invalid;
      default:
        return false;
    }
  }

  onRoleChange(role: string) {
    const step4 = this.step4Form;
    const frontend = step4.get('frontend');
    const backend = step4.get('backend');

    if (role === 'Frontend') {
      backend?.reset();
      backend?.disable();
      frontend?.enable();
    } else if (role === 'Backend') {
      frontend?.reset();
      frontend?.disable();
      backend?.enable();
    } else {
      frontend?.enable();
      backend?.enable();
    }
  }

  getFrameworksFor(lang: string): string[] {
    return this.languageFrameworks[lang] || [];
  }

  onStepChange(event: MyStepperSelectionEvent) {
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
      { label: 'Date of Birth', value: value.step1.dob },
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
            ? (frontend.languages || []).join(', ')
            : 'N/A',
      },
      {
        label: 'Frontend Frameworks',
        value:
          value.step4.role !== 'Backend'
            ? (frontend.frameworks || []).join(', ')
            : 'N/A',
      },
      {
        label: 'Backend Languages',
        value:
          value.step4.role !== 'Frontend'
            ? (backend.languages || []).join(', ')
            : 'N/A',
      },
      {
        label: 'Backend Frameworks',
        value:
          value.step4.role !== 'Frontend'
            ? (backend.frameworks || []).join(', ')
            : 'N/A',
      },
    ];
  }

  finish() {
    // if (this.form.valid) {
    //   const value = this.form.value;
    //   const frontend = value.step4.frontend;
    //   const backend = value.step4.backend;
    //   this.summaryData = [
    //     { label: 'Name', value: value.step1.name },
    //     { label: 'Surname', value: value.step1.surname },
    //     { label: 'Date of Birth', value: value.step1.dob },
    //     { label: 'Email', value: value.step1.email },
    //     { label: 'Phone', value: value.step1.phone },
    //     { label: 'Emergency Phone', value: value.step1.emergencyPhone },
    //     { label: 'Address', value: value.step2.address },
    //     { label: 'City', value: value.step2.city },
    //     { label: 'Country', value: value.step2.country },
    //     { label: 'T-shirt Size', value: value.step3.tshirt },
    //     { label: 'Allergies', value: value.step3.allergies || 'None' },
    //     { label: 'Blood Type', value: value.step3.bloodType },
    //     { label: 'Hobbies', value: value.step3.hobbies || 'None' },
    //     { label: 'LinkedIn', value: value.step3.linkedin || 'N/A' },
    //     { label: 'GitHub', value: value.step3.github || 'N/A' },
    //     { label: 'Role', value: value.step4.role },
    //     {
    //       label: 'Frontend Languages',
    //       value:
    //         value.step4.role !== 'Backend'
    //           ? (frontend.languages || []).join(', ')
    //           : 'N/A',
    //     },
    //     {
    //       label: 'Frontend Frameworks',
    //       value:
    //         value.step4.role !== 'Backend'
    //           ? (frontend.frameworks || []).join(', ')
    //           : 'N/A',
    //     },
    //     {
    //       label: 'Backend Languages',
    //       value:
    //         value.step4.role !== 'Frontend'
    //           ? (backend.languages || []).join(', ')
    //           : 'N/A',
    //     },
    //     {
    //       label: 'Backend Frameworks',
    //       value:
    //         value.step4.role !== 'Frontend'
    //           ? (backend.frameworks || []).join(', ')
    //           : 'N/A',
    //     },
    //   ];
    //   alert('Onboarding complete!');
    //   console.log(this.form.value);
    // }
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
    if (!this.stepper) return false;
    return this.stepper.selectedIndex === this.stepper.steps.length - 1;
  }
}
