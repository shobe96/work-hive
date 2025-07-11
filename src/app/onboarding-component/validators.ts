import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validator that checks if a FormControl's value is a non-empty array.
 *
 * Use case: Applied to multi-select controls or checkboxes where an array is expected as input,
 * and at least one item must be selected.
 *
 * Returns a `ValidationErrors` object with `{ nonEmptyArray: true }` if the array is empty,
 * or `null` if it has elements or is not an array.
 */
export function nonEmptyArrayValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    return Array.isArray(value) && value.length === 0
      ? { nonEmptyArray: true }
      : null;
  };
}

/**
 * Validator that checks if the input is a valid phone number.
 *
 * Accepts:
 * - Digits only (e.g. '123456789')
 * - Optional leading '+' for international format (e.g. '+123456789')
 *
 * Does NOT allow spaces, dashes, or other characters.
 *
 * Returns `{ invalidPhone: true }` if the input does not match the pattern,
 * or `null` if valid or empty (in which case another validator like `Validators.required`
 * should be used to enforce non-emptiness).
 */
export function phoneNumberValidator(): ValidatorFn {
  const phoneRegex = /^\+?\d+$/;

  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null; // Let required validator handle empty strings

    return phoneRegex.test(value) ? null : { invalidPhone: true };
  };
}

/**
 * Validator that checks if the input is a valid URL starting with http:// or https://
 *
 * Useful for validating profile links (e.g. LinkedIn, GitHub).
 *
 * Returns `{ invalidUrl: true }` if the value is non-empty and doesn't start with http/https.
 * Returns `null` for valid URLs or empty input (so combine with `Validators.required` if needed).
 */
export function urlValidator(): ValidatorFn {
  const pattern = /^https?:\/\/.+/;

  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null; // Allow optional fields to be blank

    return pattern.test(value) ? null : { invalidUrl: true };
  };
}

export function cityCountryValidator(
  citiesByCountry: Record<string, { code: string; name: string }[]>
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const country = control.get('country')?.value;
    const city = control.get('city')?.value;

    if (!country || !city) {
      return null; // Required validators handle empty cases separately
    }

    const validCities = citiesByCountry[country]?.map((c) => c.name) || [];

    if (!validCities.includes(city)) {
      return { cityCountryMismatch: true };
    }

    return null;
  };
}
