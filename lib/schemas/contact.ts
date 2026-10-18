import { z } from "zod";
import { contact } from "@/lib/content";
import { EMAIL_MAX, MESSAGE_MAX, NAME_MAX, type ContactFormInput, type ContactResult } from "./contact-form";

// One schema, used by the form (instant feedback) and the Server Action (the real check).
// The zod-free parts live in ./contact-form so the client can load this file lazily.
export * from "./contact-form";

const v = contact.validation;

export const contactSchema = z.object({
  name: z.string().trim().min(2, v.nameShort).max(NAME_MAX, v.nameLong),
  email: z.string().trim().max(EMAIL_MAX, v.emailLong).pipe(z.email(v.email)),
  message: z.string().trim().min(10, v.messageShort).max(MESSAGE_MAX, v.messageLong),
  /** Honeypot: hidden from people, so anything in it came from a bot. */
  honeypot: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export function invalidResult(error: z.ZodError<ContactInput>, input: ContactFormInput): ContactResult {
  return {
    ok: false,
    message: contact.errors.invalid,
    fieldErrors: z.flattenError(error).fieldErrors,
    values: { name: input.name, email: input.email, message: input.message },
  };
}
