import { Component, Input, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  LANGUAGE_FRAMEWORKS,
  BACKEND_LANGUAGES,
  FRONTEND_LANGUAGES,
} from './tech-stack.config';
import { FormUtilsService } from '../form-utils.service';

import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { ERROR_MESSAGES } from '../form-error-messages';

@Component({
  selector: 'app-tech-stack-step',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatRadioModule,
  ],
  templateUrl: './tech-stack-step.component.html',
  styleUrl: './tech-stack-step.component.scss',
})
export class TechStackStepComponent {
  // Parent component passes in a FormGroup
  @Input() form!: FormGroup;

  // Injecting shared service for reusable form control logic
  private formUtils = inject(FormUtilsService);

  // Constants for frameworks mapped by language, and a list of backend languages
  readonly languageFrameworks = LANGUAGE_FRAMEWORKS;
  readonly backendLanguages = BACKEND_LANGUAGES;
  readonly frontendLanguages = FRONTEND_LANGUAGES;

  /**
   * Triggered when the role radio selection changes.
   * Resets and conditionally enables frontend/backend form groups
   */
  onRoleChange(role: string): void {
    const frontend = this.form.get('frontend') as FormGroup;
    const backend = this.form.get('backend') as FormGroup;

    // Clear form groups
    this.resetFormGroups([frontend, backend]);

    // Enable the correct section(s) based on selected role
    if (role === 'Frontend') {
      this.enableDisable([frontend], [backend]);
    } else if (role === 'Backend') {
      this.enableDisable([backend], [frontend]);
    } else {
      // Fullstack or fallback: enable both
      this.enableDisable([frontend, backend]);
    }
  }

  /**
   * Resets specified FormGroups to default values.
   * Clears selected languages/frameworks.
   */
  private resetFormGroups(groups: FormGroup[]): void {
    for (const group of groups) {
      this.formUtils.updateControls(group, 'reset', {
        languages: [],
        frameworks: [],
      });
    }
  }

  /**
   * Enables or disables form groups based on user role selection.
   */
  private enableDisable(
    formGroupsToEnable: FormGroup[],
    formGroupsToDisable: FormGroup[] = []
  ): void {
    formGroupsToEnable.forEach((fg) =>
      this.formUtils.updateControls(fg, 'enable')
    );
    formGroupsToDisable.forEach((fg) =>
      this.formUtils.updateControls(fg, 'disable')
    );
  }

  /**
   * Given a programming language, returns its available frameworks.
   * Falls back to empty array if language is unknown.
   */
  getFrameworksFor(lang: string): string[] {
    return this.languageFrameworks[lang] || [];
  }

  /**
   * Returns a flat list of all frameworks corresponding to the currently selected languages.
   * Used to dynamically populate framework options in the template.
   */
  getFrameworkOptions(section: 'frontend' | 'backend'): string[] {
    const langs = this.form.get(`${section}.languages`)?.value;
    if (!Array.isArray(langs)) return [];

    const allFrameworks = langs.flatMap((lang: string) =>
      this.getFrameworksFor(lang)
    );

    // Deduplicate frameworks
    return Array.from(new Set(allFrameworks));
  }

  /**
   * Utility getter for template: returns true if 'Frontend' or 'Fullstack' role is selected.
   * Used to conditionally render the frontend section.
   */
  get isFrontendSelected(): boolean {
    const role = this.form.get('role')?.value;
    return role === 'Frontend' || role === 'Fullstack';
  }

  /**
   * Utility getter for template: returns true if 'Backend' or 'Fullstack' role is selected.
   * Used to conditionally render the backend section.
   */
  get isBackendSelected(): boolean {
    const role = this.form.get('role')?.value;
    return role === 'Backend' || role === 'Fullstack';
  }

  /**
   * Checks if a given form control path has a specific validation error.
   * Used in the template to show error messages.
   */
  hasError(path: string, errorName: string): boolean {
    return this.form.get(path)?.hasError(errorName) ?? false;
  }

  getError(controlName: string): string | null {
    const control = this.form.get(controlName);
    if (!control || !(control.touched || control.dirty) || !control.errors)
      return null;

    const controlErrors = control.errors;
    const messages = ERROR_MESSAGES[controlName];

    for (const errorKey in controlErrors) {
      if (messages && messages[errorKey]) {
        return messages[errorKey];
      }
    }

    return null;
  }
}
