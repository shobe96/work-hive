import { Validators } from '@angular/forms';
import { phoneNumberValidator } from './validators'; // adjust import path

export const STEP1_VALIDATORS = {
  name: [Validators.required],
  surname: [Validators.required],
  dob: [Validators.required],
  email: [Validators.required, Validators.email],
  phone: [Validators.required, Validators.minLength(8), phoneNumberValidator()],
  emergencyPhone: [
    Validators.required,
    Validators.minLength(8),
    phoneNumberValidator(),
  ],
};
