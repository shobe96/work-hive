export const ERROR_MESSAGES: Record<string, Record<string, string>> = {
  name: {
    required: '*name is required',
  },
  surname: {
    required: '*surname is required',
  },
  dob: {
    required: '*date of birth is required',
  },
  email: {
    required: '*email is required',
    email: '*invalid email format',
  },
  phone: {
    required: '*phone is required',
    minlength: '*minimum 8 characters',
    invalidPhone:
      '*phone number must contain only digits and may start with a "+" for international format.',
  },
  emergencyPhone: {
    required: '*emergency phone is required',
    minlength: '*minimum 8 characters',
    invalidPhone:
      '*emergency phone must contain only digits and may start with a "+" for international format.',
  },
  address: {
    required: '*address is required',
  },
  city: {
    required: '*city is required',
  },
  country: {
    required: '*country is required',
  },
  tshirt: {
    required: '*t-shirt size is required',
  },
  bloodType: {
    required: '*blood type is required',
  },
  linkedin: {
    pattern: '*invalid linkedin url',
  },
  github: {
    pattern: '*invalid github url',
  },
  role: {
    required: '*role is required',
  },
  'frontend.languages': {
    nonEmptyArray: '*select at least one frontend language',
  },
  'frontend.frameworks': {
    nonEmptyArray: '*select at least one frontend framework',
  },
  'backend.languages': {
    nonEmptyArray: '*select at least one backend language',
  },
  'backend.frameworks': {
    nonEmptyArray: '*select at least one backend framework',
  },
};
