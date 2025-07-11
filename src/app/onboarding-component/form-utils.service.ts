import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

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
}
