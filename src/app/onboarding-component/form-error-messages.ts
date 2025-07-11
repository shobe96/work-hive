// form-error-messages.ts

export const ERROR_MESSAGES: Record<string, Record<string, string>> = {
  name: {
    required: 'required',
  },
  surname: {
    required: 'required',
  },
  dob: {
    required: 'required',
  },
  email: {
    required: 'required',
    email: 'invalid email format',
  },
  phone: {
    required: 'required',
    minlength: 'minimum 8 characters',
    invalidPhone:
      'phone number must contain only digits and may start with a "+" for international format.',
  },
  emergencyPhone: {
    required: 'required',
    minlength: 'minimum 8 characters',
    invalidPhone:
      'emergency phone must contain only digits and may start with a "+" for international format.',
  },
  address: { required: 'Address is required' },
  city: { required: 'City is required' },
  country: { required: 'Country is required' },
  tshirt: {
    required: 'required',
  },
  bloodType: {
    required: 'required',
  },
  linkedin: {
    pattern: 'invalid linkedIn URL',
  },
  github: {
    pattern: 'invalid gitHub URL',
  },
  role: { required: 'Role is required' },
  'frontend.languages': {
    nonEmptyArray: 'Select at least one frontend language',
  },
  'frontend.frameworks': {
    nonEmptyArray: 'Select at least one frontend framework',
  },
  'backend.languages': {
    nonEmptyArray: 'Select at least one backend language',
  },
  'backend.frameworks': {
    nonEmptyArray: 'Select at least one backend framework',
  },
};
