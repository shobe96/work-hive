import { Validators } from '@angular/forms';

export const STEP2_VALIDATORS = {
  address: [Validators.required],
  city: [Validators.required],
  country: [Validators.required],
};
