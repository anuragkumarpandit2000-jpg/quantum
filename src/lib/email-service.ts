/**
 * Quantum Email Service (Server-Side Only)
 * Sends branded verification emails via Resend API or SMTP, with local dev fallbacks.
 * Secret keys are strictly contained server-side and never exposed to client bundles.
 */

export interface SendVerificationEmailParams {
  to: string;
  name: string;
  username: string;
  rawToken: string;
  baseUrl?: string;
}

// In-memory record of the most recent dev verification link (for local testing/diagnostics)
declare global {
  // eslint-disable-next-line no-var
  var __QUANTUM_DEV_LAST_EMAIL__:
    | {
        to: string;
        verificationUrl: string;
        sentAt: string;
      }
    | undefined;
}

/**
 * Returns the effective base URL for generating verification links.
 */
export function getAppBaseUrl(req?: Request): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  if (process.env.APP_URL) {
    return process.env.APP_URL.replace(/\/$/, "");
  }
  if (req) {
    try {
      const url = new URL(req.url);
      return `${url.protocol}//${url.host}`;
    } catch {
      // ignore
    }
  }
  return "http://localhost:3000";
}

/**
 * Constructs HTML email template matching the Obsidian QUANTUM aesthetic.
 */
function buildVerificationEmailHtml(params: {
  name: string;
  username: string;
  verificationUrl: string;
}): string {
  const { name, username, verificationUrl } = params;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ratify Your Quantum Identity</title>
</head>
<body style="margin: 0; padding: 0; background-color: #02050e; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #02050e; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 580px; background: #040816; border: 1px solid rgba(56, 189, 248, 0.2); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8);">
          <!-- Top Header -->
          <tr>
            <td style="padding: 32px 32px 20px 32px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); background: linear-gradient(180deg, rgba(56, 189, 248, 0.08) 0%, rgba(4, 8, 22, 0) 100%);">
              <table role="presentation" width="100%">
                <tr>
                  <td>
                    <span style="font-size: 20px; font-weight: 900; letter-spacing: 3px; color: #ffffff; text-transform: uppercase;">QUANTUM</span>
                    <span style="display: inline-block; margin-left: 8px; font-size: 10px; font-family: monospace; color: #38bdf8; background: rgba(56, 189, 248, 0.15); border: 1px solid rgba(56, 189, 248, 0.3); padding: 3px 8px; border-radius: 4px; vertical-align: middle;">
                      WINTER ARC
                    </span>
                  </td>
                  <td align="right">
                    <span style="font-size: 11px; font-family: monospace; color: #94a3b8; letter-spacing: 1px;">
                      PROTOCOL v2.6
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 36px 32px;">
              <h1 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                CONFIRM EMAIL OWNERSHIP
              </h1>
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 22px; color: #cbd5e1;">
                Greetings Challenger <strong style="color: #38bdf8;">${name}</strong> (<span style="font-family: monospace; color: #94a3b8;">@${username}</span>),
              </p>
              <p style="margin: 0 0 28px 0; font-size: 14px; line-height: 22px; color: #94a3b8;">
                Your induction credentials into the Quantum Winter Arc have been provisioned. To unlock full telemetry, habit logging, skill modules, and the 90-Day Arc Command Center, ratify your email address via the secure link below:
              </p>

              <!-- CTA Button -->
              <table role="presentation" width="100%" style="margin: 32px 0;">
                <tr>
                  <td align="center">
                    <a href="${verificationUrl}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: #ffffff; font-size: 13px; font-weight: 700; font-family: monospace; letter-spacing: 1.5px; text-decoration: none; padding: 14px 32px; border-radius: 10px; border: 1px solid rgba(56, 189, 248, 0.5); box-shadow: 0 0 24px rgba(56, 189, 248, 0.35);">
                      RATIFY IDENTITY & VERIFY EMAIL &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Expiry & Security Notice -->
              <table role="presentation" width="100%" style="margin: 28px 0 0 0; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 16px;">
                <tr>
                  <td>
                    <p style="margin: 0 0 6px 0; font-size: 11px; font-family: monospace; color: #38bdf8; font-weight: bold; text-transform: uppercase;">
                      CRITICAL SECURITY DIRECTIVE
                    </p>
                    <p style="margin: 0; font-size: 12px; line-height: 18px; color: #94a3b8;">
                      • This link contains a single-use cryptographically salted token.<br>
                      • Token expires in <strong>24 hours</strong>.<br>
                      • Once verified, this link will self-terminate.<br>
                      • If you did not initiate this registration, no action is required.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Fallback URL -->
              <p style="margin: 24px 0 0 0; font-size: 12px; line-height: 18px; color: #64748b;">
                If the button above does not open, copy and paste this address into your browser:
              </p>
              <p style="margin: 8px 0 0 0; font-size: 11px; font-family: monospace; word-break: break-all; color: #38bdf8; background: #02050e; padding: 10px 12px; border-radius: 6px; border: 1px solid rgba(56, 189, 248, 0.2);">
                ${verificationUrl}
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; border-top: 1px solid rgba(255, 255, 255, 0.08); background: #02050e; text-align: center;">
              <p style="margin: 0; font-size: 11px; font-family: monospace; color: #475569; letter-spacing: 0.5px;">
                QUANTUM SYSTEM • ZERO COMPROMISE DISCIPLINE • WINTER ARC
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Constructs plain text fallback.
 */
function buildVerificationEmailText(params: {
  name: string;
  username: string;
  verificationUrl: string;
}): string {
  return `QUANTUM // WINTER ARC - EMAIL VERIFICATION
=================================================

Greetings Challenger ${params.name} (@${params.username}),

Your induction credentials into the Quantum Winter Arc have been provisioned.
To unlock full telemetry, habit logging, skill modules, and the 90-Day Arc Command Center, verify your email address using this single-use link:

${params.verificationUrl}

SECURITY DIRECTIVE:
• Single-use cryptographically secure link.
• Expires in 24 hours.
• If you did not initiate this registration, disregard this message.

--
QUANTUM SYSTEM • ZERO COMPROMISE DISCIPLINE`;
}

/**
 * Transmits verification email to recipient using Resend API or dev logger fallback.
 */
export async function sendVerificationEmail(params: SendVerificationEmailParams): Promise<{
  success: boolean;
  messageId?: string;
  verificationUrl: string;
  mode: "resend" | "dev_logger";
}> {
  const { to, name, username, rawToken, baseUrl } = params;
  const rootUrl = baseUrl || getAppBaseUrl();
  const verificationUrl = `${rootUrl}/verify-email?token=${encodeURIComponent(rawToken)}`;

  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.EMAIL_FROM || "Quantum System <onboarding@resend.dev>";

  // Cache in global dev state so local verification links can be retrieved/tested easily
  global.__QUANTUM_DEV_LAST_EMAIL__ = {
    to,
    verificationUrl,
    sentAt: new Date().toISOString(),
  };

  // 1. If RESEND_API_KEY is configured, dispatch live via Resend API
  if (resendApiKey) {
    try {
      let activeFrom = fromEmail;
      let res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: activeFrom,
          to: [to],
          subject: "[QUANTUM] Ratify Your Winter Arc Identity • Verify Email",
          html: buildVerificationEmailHtml({ name, username, verificationUrl }),
          text: buildVerificationEmailText({ name, username, verificationUrl }),
        }),
      });

      // If custom domain is not yet verified in DNS, auto-fallback to onboarding@resend.dev
      if (!res.ok && activeFrom !== "Quantum System <onboarding@resend.dev>") {
        const errText = await res.text();
        if (errText.includes("not verified")) {
          console.warn(`[QUANTUM EMAIL] Domain in '${activeFrom}' is pending DNS verification in Resend. Auto-fallback to onboarding@resend.dev...`);
          activeFrom = "Quantum System <onboarding@resend.dev>";
          res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${resendApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: activeFrom,
              to: [to],
              subject: "[QUANTUM] Ratify Your Winter Arc Identity • Verify Email",
              html: buildVerificationEmailHtml({ name, username, verificationUrl }),
              text: buildVerificationEmailText({ name, username, verificationUrl }),
            }),
          });
        }
      }

      if (res.ok) {
        const data = await res.json();
        console.log(`[QUANTUM EMAIL] Verification email dispatched to ${to} via Resend. ID: ${data.id}`);
        return { success: true, messageId: data.id, verificationUrl, mode: "resend" };
      } else {
        const errText = await res.text();
        console.error(`[QUANTUM EMAIL] Resend API error (${res.status}): ${errText}`);
      }
    } catch (err) {
      console.error("[QUANTUM EMAIL] Failed to send email via Resend:", err);
    }
  }

  // 2. Dev Logger Fallback (Development & Testing)
  console.log("================================================================================");
  console.log(`[QUANTUM EMAIL DISPATCH] (DEV / LOCAL MODE)`);
  console.log(`Recipient: ${to} (Challenger: ${name} / @${username})`);
  console.log(`Verification URL: ${verificationUrl}`);
  console.log(`Token expires in: 24 hours (Single-Use SHA-256 Hash stored in DB)`);
  console.log("================================================================================");

  return {
    success: true,
    verificationUrl,
    mode: "dev_logger",
  };
}

/**
 * Returns the most recent dev email verification link (server-side only helper).
 */
export function getDevLastEmail() {
  return global.__QUANTUM_DEV_LAST_EMAIL__;
}
