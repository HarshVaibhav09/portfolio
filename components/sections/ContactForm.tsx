"use client";

import { useActionState, useEffect, useRef } from "react";
import { Loader2, Send } from "lucide-react";
import { sendContact } from "@/app/actions/contact";
import { Button } from "@/components/ui/Button";
import { contact } from "@/lib/content";
import {
  HONEYPOT_FIELD,
  initialContactResult,
  MESSAGE_MAX,
  NAME_MAX,
  readContactForm,
  type ContactField,
  type ContactResult,
} from "@/lib/schemas/contact-form";
import { cn } from "@/lib/utils";

const FIELDS: ContactField[] = ["name", "email", "message"];

const inputClass =
  "w-full rounded-xl border border-border bg-bg-raised/60 px-4 py-3 text-text placeholder:text-muted " +
  "transition-colors hover:border-accent/40 aria-invalid:border-danger";

// The schema pulls in zod, so it loads on demand instead of with the page. Prefetched when
// the visitor first focuses the form, so it is normally ready by the time they submit.
const loadSchema = () => import("@/lib/schemas/contact");

// Validate in the browser with the same schema first (instant feedback, no round trip),
// then let the Server Action validate again and send.
async function validateThenSend(prev: ContactResult, formData: FormData): Promise<ContactResult> {
  const input = readContactForm(formData);
  // A filled honeypot goes straight to the server, which quietly drops it.
  if (!input.honeypot) {
    const { contactSchema, invalidResult } = await loadSchema();
    const parsed = contactSchema.safeParse(input);
    if (!parsed.success) return invalidResult(parsed.error, input);
  }
  return sendContact(prev, formData);
}

interface FieldProps {
  name: ContactField;
  error?: string;
  defaultValue?: string;
  type?: string;
  autoComplete?: string;
  maxLength?: number;
  multiline?: boolean;
}

function Field({ name, error, defaultValue, type = "text", autoComplete, maxLength, multiline }: FieldProps) {
  const id = `contact-${name}`;
  const errorId = `${id}-error`;
  const copy = contact.fields[name];
  const shared = {
    id,
    name,
    required: true,
    maxLength,
    defaultValue,
    placeholder: copy.placeholder,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
  };

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-text">
        {copy.label}
      </label>
      {multiline ? (
        <textarea rows={5} className={cn(inputClass, "resize-y")} {...shared} />
      ) : (
        <input type={type} autoComplete={autoComplete} className={inputClass} {...shared} />
      )}
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export function ContactForm() {
  const [state, formAction, pending] = useActionState(validateThenSend, initialContactResult);
  const formRef = useRef<HTMLFormElement>(null);

  // After a failed submit, move focus to the first invalid field.
  useEffect(() => {
    const first = FIELDS.find((field) => state.fieldErrors?.[field]);
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  }, [state]);

  const errorFor = (field: ContactField) => state.fieldErrors?.[field]?.[0];

  return (
    // noValidate: the schema's messages replace the browser's bubbles; required/type stay for semantics.
    // React resets the form after each submit; on failure `values` refill it, on success it stays empty.
    <form
      ref={formRef}
      action={formAction}
      onFocus={() => void loadSchema()}
      noValidate
      className="relative space-y-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="name" autoComplete="name" maxLength={NAME_MAX} error={errorFor("name")} defaultValue={state.values?.name} />
        <Field name="email" type="email" autoComplete="email" error={errorFor("email")} defaultValue={state.values?.email} />
      </div>
      <Field name="message" multiline maxLength={MESSAGE_MAX} error={errorFor("message")} defaultValue={state.values?.message} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button type="submit" variant="outline" disabled={pending} className="w-full shrink-0 sm:w-auto">
          {pending ? (
            <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
          ) : (
            <Send className="size-4" aria-hidden="true" />
          )}
          {pending ? contact.sending : contact.submit}
        </Button>
        {/* role="status" is a polite live region: announced to screen readers when it changes */}
        <p role="status" className={cn("text-sm", state.ok ? "text-success" : "text-danger")}>
          {state.message}
        </p>
      </div>

      {/* Honeypot. Only bots fill it; a real visitor must never be able to, because the server
          silently drops any message where it has a value. So it is:
          - off-screen, not display:none (some bots skip fields they can tell are hidden);
          - inert + tabIndex -1 + aria-hidden: unfocusable and out of the accessibility tree.
            Chrome does not autofill fields that cannot be focused, and an inert input is still
            submitted with the form (unlike a disabled one);
          - named and labeled with nothing autofill heuristics recognize, placed after the
            submit row rather than beside the real name and email inputs;
          - autoComplete off, plus the opt-out attributes 1Password, LastPass, Bitwarden and
            Dashlane read. */}
      <div aria-hidden="true" inert className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden">
        <label htmlFor={`cf-${HONEYPOT_FIELD}`}>{contact.honeypotLabel}</label>
        <input
          id={`cf-${HONEYPOT_FIELD}`}
          name={HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          data-1p-ignore
          data-lpignore="true"
          data-bwignore
          data-form-type="other"
        />
      </div>
    </form>
  );
}
