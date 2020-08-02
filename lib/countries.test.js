import { getCountryAlpha2, getCountry } from './countries';

describe('getCountryAlpha2', () => {
  test('returns a valid country object from an alpha 3', () => {
    const alpha2 = getCountryAlpha2('ARG');
    expect(alpha2).toBe('AR');
  });
  test('returns a valid country object from an alpha 2', () => {
    const alpha2 = getCountryAlpha2('AR');
    expect(alpha2).toBe('AR');
  });
  test('returns a valid country object from a country name', () => {
    const alpha2 = getCountryAlpha2('argentina');
    expect(alpha2).toBe('AR');
  });
});

describe('getCountry', () => {
  test('returns a country object from an alpha 2', () => {
    const country = getCountry('AR');
    expect(country.name).toBe('Argentina');
    expect(country.emoji).toBe('🇦🇷');
  });
});
