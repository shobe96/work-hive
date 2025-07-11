// src/app/data/cities-by-country.ts

export interface LocationOption {
  code: string;
  name: string;
}

export const COUNTRIES: LocationOption[] = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'JP', name: 'Japan' },
  // Add more countries as needed
];

export const CITIES_BY_COUNTRY: Record<string, LocationOption[]> = {
  US: [
    { code: 'NYC', name: 'New York' },
    { code: 'SF', name: 'San Francisco' },
    { code: 'LA', name: 'Los Angeles' },
  ],
  CA: [
    { code: 'TOR', name: 'Toronto' },
    { code: 'VAN', name: 'Vancouver' },
    { code: 'MON', name: 'Montreal' },
  ],
  FR: [
    { code: 'PAR', name: 'Paris' },
    { code: 'LYO', name: 'Lyon' },
    { code: 'MAR', name: 'Marseille' },
  ],
  DE: [
    { code: 'BER', name: 'Berlin' },
    { code: 'MUN', name: 'Munich' },
    { code: 'FRA', name: 'Frankfurt' },
  ],
  JP: [
    { code: 'TOK', name: 'Tokyo' },
    { code: 'OSA', name: 'Osaka' },
    { code: 'KYO', name: 'Kyoto' },
  ],
};
