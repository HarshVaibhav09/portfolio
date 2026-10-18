import { z } from "zod";
import { contact } from "@/lib/content";

// One schema, used by the form (instant feedback) and the Server Action (the real check).
export const NAME_MAX = 80;
export const MESSAGE_MAX = 2000;

const v = contact.validation;

export const contactSchema = z.object({
  name: z.string().trim().min(2, v.nameShort).max(NAME_MAX, v.nameLong),
  email: z.string().trim().pipe(z.email(v.email)),
  message: z.string().trim().min(10, v.messageShort).max(MESSAGE_MAX, v.messageLong),
  /** Honeypot: hidden from people, so anything in it came from a bot. */
  website: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = "name" | "email" | "message";

export interface ContactResult {
  ok: boolean;
  message: string;
  fieldErrors?: Partial<Record<keyof ContactInput, string[]>>;
  /** Submitted values, returned on failure so the form can show them again after React resets it. */
  values?: Record<ContactField, string>;
}

export const initialContactResult: ContactResult = { ok: false, message: "" };

/** Reads the raw string fields both sides validate. */
export function readContactForm(formData: FormData) {
  const get = (key: string) => {
    const value = formData.get(key);
    return typeof value === "string" ? value : "";
  };
  return { name: get("name"), email: get("email"), message: get("message"), website: get("website") };
}

export function invalidResult(error: z.ZodError<ContactInput>, input: ReturnType<typeof readContactForm>): ContactResult {
  return {
    ok: false,
    message: contact.errors.invalid,
    fieldErrors: z.flattenError(error).fieldErrors,
    values: { name: input.name, email: input.email, message: input.message },
  };
}
