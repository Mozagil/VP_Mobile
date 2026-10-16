import { langFromLocale, pickLang } from '../deviceLang';

describe('device language', () => {
  it('maps Turkish locales to Turkish and every other language to English', () => {
    expect(langFromLocale('tr')).toBe('tr');
    expect(langFromLocale('tr-TR')).toBe('tr');
    expect(langFromLocale('tr_TR')).toBe('tr');
    expect(langFromLocale('TR-tr')).toBe('tr');
    expect(langFromLocale('en-US')).toBe('en');
    expect(langFromLocale('de_DE')).toBe('en');
    expect(langFromLocale('nl-NL')).toBe('en');
  });

  it('ignores values that do not name a language', () => {
    expect(langFromLocale(undefined)).toBeNull();
    expect(langFromLocale('')).toBeNull();
    expect(langFromLocale('und')).toBeNull();
    expect(langFromLocale('123')).toBeNull();
  });

  it('takes the first usable candidate and falls back to Turkish', () => {
    expect(pickLang([undefined, 'en-GB', 'tr-TR'])).toBe('en');
    expect(pickLang([null, '', 'tr_TR'])).toBe('tr');
    expect(pickLang([undefined, null])).toBe('tr');
  });
});
