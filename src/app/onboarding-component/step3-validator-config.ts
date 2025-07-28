import { Validators } from '@angular/forms';
import { urlValidator } from './validators'; // adjust path

export const STEP3_VALIDATORS = {
  tshirt: [Validators.required],
  bloodType: [Validators.required],
  linkedin: [urlValidator()],
  github: [urlValidator()],
};
