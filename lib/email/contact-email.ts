import { contact } from "@/lib/content";
import { escapeHtml } from "@/lib/utils";

export interface ContactEmailInput {
  /** Already validated and trimmed by contactSchema. */
  name: string;
  email: string;
  message: string;
  receivedAt: Date;
}

export interface ContactEmail {
  subject: string;
  html: string;
  text: string;
}

const copy = contact.notificationEmail;
const ACCENT = "#FF8E53"; // top border only
const HEADER_COLOR = "#D9480F"; // light-mode accent: about 4.6:1 on white, passes WCAG AA for small text
const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

/** "18 Oct 2026, 9:51 PM IST". Asia/Kolkata has no daylight saving, so the zone is always IST. */
export function formatReceived(date: Date): string {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kolkata",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
      .formatToParts(date)
      .map((part) => [part.type, part.value]),
  );
  return `${parts.day} ${parts.month} ${parts.year}, ${parts.hour}:${parts.minute} ${parts.dayPeriod} IST`;
}

/** One label/value row of the details table. `valueHtml` must already be escaped. */
function row(label: string, valueHtml: string): string {
  return `<tr>
<td style="padding:6px 16px 6px 0;width:88px;vertical-align:top;font-size:13px;color:#6B7280;">${escapeHtml(label)}</td>
<td style="padding:6px 0;vertical-align:top;font-size:15px;color:#111827;word-break:break-word;">${valueHtml}</td>
</tr>`;
}

export function buildContactEmail({ name, email, message, receivedAt }: ContactEmailInput): ContactEmail {
  // A line break in a subject could break the email header, so flatten them.
  const subject = copy.subject.replace("{name}", name.replace(/[\r\n]+/g, " "));
  const received = formatReceived(receivedAt);
  const body = message.replace(/\r\n?/g, "\n");

  // Every visitor-provided value is escaped before it touches HTML, including the mailto href.
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(body).replace(/\n/g, "<br>");

  // Email-client-safe: tables, inline styles, system fonts, no images or external CSS.
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:#FFFFFF;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#FFFFFF;">
<tr>
<td align="center" style="padding:24px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background-color:#FFFFFF;border:1px solid #E5E7EB;border-top:3px solid ${ACCENT};border-radius:8px;font-family:${FONT};color:#111827;">
<tr>
<td style="padding:24px 28px 8px 28px;font-size:13px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:${HEADER_COLOR};">${escapeHtml(copy.heading)}</td>
</tr>
<tr>
<td style="padding:8px 28px 4px 28px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
${row(copy.labels.name, safeName)}
${row(copy.labels.email, `<a href="mailto:${safeEmail}" style="color:#111827;text-decoration:underline;">${safeEmail}</a>`)}
</table>
</td>
</tr>
<tr>
<td style="padding:16px 28px 0 28px;font-size:13px;color:#6B7280;">${escapeHtml(copy.labels.message)}</td>
</tr>
<tr>
<td style="padding:8px 28px 8px 28px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td style="padding:16px 18px;background-color:#F9FAFB;border:1px solid #E5E7EB;border-radius:6px;font-size:15px;line-height:1.6;color:#111827;word-break:break-word;">${safeMessage}</td>
</tr>
</table>
</td>
</tr>
<tr>
<td style="padding:8px 28px 24px 28px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
${row(copy.labels.received, escapeHtml(received))}
</table>
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>`;

  // Plain-text fallback: same content, labels padded so the values line up.
  const labelWidth = Math.max(copy.labels.name.length, copy.labels.email.length, copy.labels.received.length) + 2;
  const line = (label: string, value: string) => `${`${label}:`.padEnd(labelWidth)}${value}`;
  const text = [
    copy.heading,
    "",
    line(copy.labels.name, name),
    line(copy.labels.email, email),
    line(copy.labels.received, received),
    "",
    "-".repeat(40),
    "",
    body,
  ].join("\n");

  return { subject, html, text };
}
