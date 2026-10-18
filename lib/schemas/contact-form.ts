// The zod-free half of the contact contract: limits, result types and form reading.
// ContactForm imports this statically and loads the zod schema (./contact) only on demand,
// which keeps zod out of the page's first-load JS.
import type { ContactInput } from "./contact";

export const NAME_MAX = 80;
/** RFC 5321 limit for a full address. */
export const EMAIL_MAX = 254;
export const MESSAGE_MAX = 2000;

export type ContactField = "name" | "email" | "message";

/**
 * Form field name of the honeypot. Deliberately meaningless: browsers and password managers
 * classify fields by name, id and label, and a recognizable name ("website" was one) gets
 * autofilled, which silently dropped real messages.
 */
export const HONEYPOT_FIELD = "zq7k";

/** Raw form values as strings, before validation. `honeypot` must stay empty. */
export type ContactFormInput = Record<ContactField | "honeypot", string>;

export interface ContactResult {
  ok: boolean;
  message: string;
  fieldErrors?: Partial<Record<keyof ContactInput, string[]>>;
  /** Submitted values, returned on failure so the form can show them again after React resets it. */
  values?: Record<ContactField, string>;
}

export const initialContactResult: ContactResult = { ok: false, message: "" };

/** Reads the raw string fields both sides validate. */
export function readContactForm(formData: FormData): ContactFormInput {
  const get = (key: string): string => {
    const value = formData.get(key);
    return typeof value === "string" ? value : "";
  };
  return { name: get("name"), email: get("email"), message: get("message"), honeypot: get(HONEYPOT_FIELD) };
}
