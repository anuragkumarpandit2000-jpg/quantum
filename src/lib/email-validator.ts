/**
 * Quantum Email Validator
 * Enforces email syntax and blocks known temporary/disposable email domains.
 */

// Comprehensive blacklist of temporary/disposable email domains
const DISPOSABLE_EMAIL_DOMAINS: string[] = [
  // Popular throwaway services
  "10minutemail.com",
  "10minutemail.net",
  "10minmail.com",
  "20minutemail.com",
  "mailinator.com",
  "tempmail.com",
  "temp-mail.org",
  "temp-mail.io",
  "guerrillamail.com",
  "guerrillamail.net",
  "guerrillamail.biz",
  "guerrillamail.org",
  "guerrillamailblock.com",
  "sharklasers.com",
  "grr.la",
  "spam4.me",
  "yopmail.com",
  "yopmail.fr",
  "yopmail.net",
  "throwawaymail.com",
  "dispostable.com",
  "fakeinbox.com",
  "getairmail.com",
  "mohmal.com",
  "nada.ltd",
  "getnada.com",
  "burnermail.io",
  "crazymailing.com",
  "inboxkitten.com",
  "fakemailgenerator.com",
  "mytemp.email",
  "dropmail.me",
  "emailondeck.com",
  "generator.email",
  "spambog.com",
  "tempr.email",
  "discard.email",
  "trashmail.net",
  "trashmail.com",
  "trashmail.de",
  "tempmailaddress.com",
  "dayrep.com",
  "teleworm.us",
  "armyspy.com",
  "cuvox.de",
  "fleckens.hu",
  "gustr.com",
  "jourrapide.com",
  "rhyta.com",
  "superrito.com",
  "maildrop.cc",
  "disposablemail.com",
  "tempinbox.com",
  "fake-box.com",
  "harakirimail.com",
  "boun.cr",
  "byom.de",
  "drdrb.com",
  "incognitomail.org",
  "jetable.org",
  "kasmail.com",
  "mailexpire.com",
  "mailcatch.com",
  "mailnesia.com",
  "meltmail.com",
  "mintemail.com",
  "mytrashmail.com",
  "nomail.xl.cx",
  "oneoffmail.com",
  "pookmail.com",
  "safetymail.info",
  "spamavert.com",
  "spambox.us",
  "spamfree24.org",
  "spaml.de",
  "spamex.com",
  "trbvm.com",
  "uggsrock.com",
  "wegwerfmail.de",
  "wegwerfmail.net",
  "whyspam.me",
  "zillamail.com",
  "tmail.ws",
  "tmpmail.net",
  "tmpmail.org",
  "crazymail.com",
];

const DISPOSABLE_DOMAINS_SET = new Set(DISPOSABLE_EMAIL_DOMAINS);

export interface EmailValidationResult {
  isValid: boolean;
  normalizedEmail?: string;
  error?: string;
}

/**
 * Validates syntax, structure, and domain authenticity.
 */
export function validateChallengerEmail(rawEmail: string): EmailValidationResult {
  if (!rawEmail || typeof rawEmail !== "string") {
    return { isValid: false, error: "Email address is required." };
  }

  const email = rawEmail.trim().toLowerCase();

  // Basic RFC 5322 regex validation
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: "Please provide a valid email format (e.g. name@domain.com)." };
  }

  const parts = email.split("@");
  if (parts.length !== 2) {
    return { isValid: false, error: "Invalid email structure." };
  }

  const [localPart, domain] = parts;

  if (localPart.length === 0 || localPart.length > 64) {
    return { isValid: false, error: "Email username is invalid or exceeds 64 characters." };
  }

  if (domain.length < 3 || domain.length > 255) {
    return { isValid: false, error: "Email domain length is invalid." };
  }

  // Ensure domain contains a valid TLD
  const domainParts = domain.split(".");
  if (domainParts.length < 2) {
    return { isValid: false, error: "Email domain must include a valid top-level domain." };
  }

  const tld = domainParts[domainParts.length - 1];
  if (tld.length < 2) {
    return { isValid: false, error: "Top-level domain extension is invalid." };
  }

  // Check against disposable domain blocklist
  if (DISPOSABLE_DOMAINS_SET.has(domain)) {
    return {
      isValid: false,
      error: "Temporary or disposable email domains are blocked. Please use an authentic personal or professional address.",
    };
  }

  // Check subdomains against disposable list (e.g. *.mailinator.com)
  const isSubdomainBlocked = DISPOSABLE_EMAIL_DOMAINS.some((blocked) =>
    domain.endsWith(`.${blocked}`)
  );
  if (isSubdomainBlocked) {
    return {
      isValid: false,
      error: "Temporary or disposable email providers are blocked. Please use an authentic personal or professional address.",
    };
  }

  return {
    isValid: true,
    normalizedEmail: email,
  };
}
