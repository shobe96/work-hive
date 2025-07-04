import { AbstractControl, ValidationErrors } from '@angular/forms';

export function nonEmptyArrayValidator(
  control: AbstractControl
): ValidationErrors | null {
  const value = control.value;
  if (Array.isArray(value) && value.length === 0) {
    return { nonEmptyArray: true };
  }
  return null;
}
