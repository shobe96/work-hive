import { Validators } from '@angular/forms';
import { nonEmptyArrayValidator } from './validators';

export const STEP4_VALIDATORS = {
  role: [Validators.required],
  'frontend.languages': [nonEmptyArrayValidator()],
  'frontend.frameworks': [nonEmptyArrayValidator()],
  'backend.languages': [nonEmptyArrayValidator()],
  'backend.frameworks': [nonEmptyArrayValidator()],
};
