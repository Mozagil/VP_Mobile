// Maps common email domains to their webmail login page so users can jump
// straight to their inbox after registration, mirrors SaaS/src/utils/mailProvider.ts.
const WEBMAIL_URLS: Record<string, string> = {
  'gmail.com': 'https://mail.google.com/mail/',
  'googlemail.com': 'https://mail.google.com/mail/',
  'outlook.com': 'https://outlook.live.com/mail/',
  'hotmail.com': 'https://outlook.live.com/mail/',
  'live.com': 'https://outlook.live.com/mail/',
  'msn.com': 'https://outlook.live.com/mail/',
  'yahoo.com': 'https://mail.yahoo.com/',
  'yahoo.co.uk': 'https://mail.yahoo.com/',
  'ymail.com': 'https://mail.yahoo.com/',
  'icloud.com': 'https://www.icloud.com/mail/',
  'me.com': 'https://www.icloud.com/mail/',
  'mac.com': 'https://www.icloud.com/mail/',
  'yandex.com': 'https://mail.yandex.com/',
  'yandex.com.tr': 'https://mail.yandex.com/',
  'yandex.ru': 'https://mail.yandex.com/',
  'protonmail.com': 'https://mail.proton.me/',
  'proton.me': 'https://mail.proton.me/',
};

export function getWebmailUrl(email: string): string | null {
  const domain = email.trim().toLowerCase().split('@')[1];
  if (!domain) return null;
  if (WEBMAIL_URLS[domain]) return WEBMAIL_URLS[domain];
  // Best-effort fallback for unrecognized domains (company mail, smaller
  // providers) — many host webmail directly on their own domain.
  return `https://${domain}`;
}
