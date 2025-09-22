import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { ERROR_MESSAGES } from './form-error-messages';
import { STEP4_VALIDATORS } from './step4-validator-config';

@Injectable({
  providedIn: 'root',
})
export class FormUtilsService {
  /**
   * Common options used for form control updates to avoid emitting extra value change events.
   */
  private readonly options = { emitEvent: false };

  /**
   * Applies a bulk action (`enable`, `disable`, or `reset`) to all controls in the given FormGroup.
   * Optionally allows resetting each control with a specific value.
   *
   * @param group - The FormGroup whose controls will be modified.
   * @param action - The action to perform on each control ('enable' | 'disable' | 'reset').
   * @param resetValue - Optional map of values to use when resetting controls.
   */
  updateControls<T extends Record<string, unknown>>(
    group: FormGroup,
    action: 'enable' | 'disable' | 'reset',
    resetValue?: T
  ): void {
    Object.entries(group.controls).forEach(([key, control]) => {
      if (!control) return;

      const value = resetValue?.[key as keyof T];

      this.applyAction(control, action, value);
    });
  }

  /**
   * Applies a specific action to an individual form control.
   *
   * @param control - The AbstractControl to act upon.
   * @param action - The type of action to perform ('enable', 'disable', or 'reset').
   * @param value - Optional value to use if the action is 'reset'.
   */
  private applyAction(
    control: AbstractControl,
    action: 'enable' | 'disable' | 'reset',
    value?: unknown
  ): void {
    switch (action) {
      case 'enable':
        control.enable(this.options);
        break;
      case 'disable':
        control.disable(this.options);
        break;
      case 'reset':
        this.resetControl(control, value);
        break;
    }
  }

  /**
   * Resets a single control to the specified value without emitting change events.
   *
   * @param control - The form control to reset.
   * @param value - The value to reset the control to (defaults to `null`).
   */
  private resetControl(control: AbstractControl, value: unknown = null): void {
    control.reset(value, this.options);
  }

  /**
   * Returns a human-readable error message for a given control in a form group.
   * Handles required, custom messages, and specific edge cases like city-country mismatch.
   */
  getError(form: FormGroup, controlName: string): string | null {
    const control = form.get(controlName);

    // ✅ Show errors if control is touched OR dirty
    if (!control || !(control.touched || control.dirty) || !control.errors) {
      return null;
    }

    const controlErrors = control.errors;
    const messages = ERROR_MESSAGES[controlName];

    for (const errorKey in controlErrors) {
      if (controlName === 'city' && errorKey === 'cityCountryMismatch') {
        return 'Selected city does not belong to the selected country.';
      }

      if (messages && messages[errorKey]) {
        return messages[errorKey];
      }
    }

    if (controlErrors['required']) {
      return '*required';
    }

    return null;
  }

  /**
   * Marks all controls in the given FormGroup as touched and dirty.
   * Useful for triggering validation messages on form submission.
   *
   * @param group - The FormGroup whose controls will be marked.
   */
  markAsTouchedAndDirty(group: FormGroup): void {
    Object.keys(group.controls).forEach((key) => {
      const control = group.get(key);
      if (control) {
        control.markAsTouched(this.options);
        control.markAsDirty(this.options);
        control.updateValueAndValidity(this.options);
      }
    });
  }

  /**
   * Clears all validators on each control in the provided FormGroups,
   * then updates their validity state.
   *
   * @param groups - An array of FormGroup instances.
   */
  clearValidators(groups: FormGroup[]): void {
    for (const group of groups) {
      Object.keys(group.controls).forEach((key) => {
        const control = group.get(key);
        if (control) {
          control.clearValidators();
          control.updateValueAndValidity(this.options);
        }
      });
    }
  }

  /**
   * Resets all controls in the given FormGroups to their default values.
   * Useful for clearing forms or resetting to initial state.
   *
   * @param groups - An array of FormGroup instances to reset.
   * @param defaultValues - Optional default values to reset controls to.
   */
  resetFormGroups<T extends Record<string, unknown>>(
    groups: FormGroup[],
    defaultValues: T = {} as T
  ): void {
    for (const group of groups) {
      this.updateControls(group, 'reset', defaultValues);
    }
  }

  /**
   * Handles role change logic by resetting relevant form groups,
   * clearing validators, and applying new validators based on the selected role.
   *
   * @param form - The main FormGroup containing frontend and backend subgroups.
   * @param currentRole - The newly selected role.
   * @param previousRole - The previously selected role (optional).
   */
  handleRoleChange(
    form: FormGroup,
    currentRole: string | null,
    previousRole: string | null = null
  ): void {
    if (currentRole === previousRole) {
      return; // ✅ No need to reset if role hasn't changed
    }

    const frontend = form.get('frontend') as FormGroup;
    const backend = form.get('backend') as FormGroup;

    this.resetFormGroups([frontend, backend], {
      languages: [],
      frameworks: [],
    });
    this.clearValidators([frontend, backend]);

    if (currentRole === 'Frontend') {
      this.setCustomValidators(frontend, {
        languages: STEP4_VALIDATORS['frontend.languages'],
        frameworks: STEP4_VALIDATORS['frontend.frameworks'],
      });
      // this.markAsTouchedAndDirty(frontend);
    } else if (currentRole === 'Backend') {
      this.setCustomValidators(backend, {
        languages: STEP4_VALIDATORS['backend.languages'],
        frameworks: STEP4_VALIDATORS['backend.frameworks'],
      });
      // this.markAsTouchedAndDirty(backend);
    } else if (currentRole === 'Fullstack') {
      this.setCustomValidators(frontend, {
        languages: STEP4_VALIDATORS['frontend.languages'],
        frameworks: STEP4_VALIDATORS['frontend.frameworks'],
      });
      this.setCustomValidators(backend, {
        languages: STEP4_VALIDATORS['backend.languages'],
        frameworks: STEP4_VALIDATORS['backend.frameworks'],
      });
      // this.markAsTouchedAndDirty(frontend);
      // this.markAsTouchedAndDirty(backend);
    }
  }

  /**
   * Sets custom validators for specific controls in a FormGroup.
   * Useful for applying role-based validation dynamically.
   *
   * @param form - The FormGroup to modify.
   * @param config - An object mapping control names to arrays of ValidatorFn.
   */
  setCustomValidators(
    form: FormGroup,
    config: Record<string, ValidatorFn[]>
  ): void {
    Object.entries(config).forEach(([key, validators]) => {
      const control = form.get(key);
      if (control) {
        control.setValidators(validators);
        control.updateValueAndValidity(this.options);
      }
    });
  }

  /**
   * Sets validators on a whole FormGroup.
   *
   * @param group - The FormGroup to set validators on.
   * @param validators - A ValidatorFn or array of ValidatorFn to set.
   */
  setGroupValidators(
    group: FormGroup,
    validators: ValidatorFn | ValidatorFn[]
  ): void {
    group.setValidators(validators);
    group.updateValueAndValidity(this.options);
  }

  /**
   * Sets address validators for the address form group based on the provided citiesByCountry data.
   * This ensures that the selected city matches the selected country.
   *
   * @param form - The FormGroup containing 'country' and 'city' controls.
   * @param citiesByCountry - A mapping of country codes to their respective cities.
   */
  setAddressValidators(
    form: FormGroup,
    citiesByCountry: Record<string, { code: string; name: string }[]>
  ) {
    const validator: ValidatorFn = (
      group: AbstractControl
    ): ValidationErrors | null => {
      const country = group.get('country')?.value;
      const city = group.get('city')?.value;

      if (!country || !city) return null;

      const validCities = citiesByCountry[country]?.map((c) => c.name) || [];

      if (!validCities.includes(city)) {
        return { cityCountryMismatch: true };
      }

      return null;
    };

    form.setValidators(validator);
    form.updateValueAndValidity(this.options);
  }
}
