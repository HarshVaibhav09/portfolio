"use client";

import { useActionState, useEffect, useRef } from "react";
import { Loader2, Send } from "lucide-react";
import { sendContact } from "@/app/actions/contact";
import { Button } from "@/components/ui/Button";
import { contact } from "@/lib/content";
import {
  contactSchema,
  initialContactResult,
  invalidResult,
  MESSAGE_MAX,
  NAME_MAX,
  readContactForm,
  type ContactField,
  type ContactResult,
} from "@/lib/schemas/contact";
import { cn } from "@/lib/utils";

const FIELDS: ContactField[] = ["name", "email", "message"];

const inputClass =
  "w-full rounded-xl border border-border bg-bg-raised/60 px-4 py-3 text-text placeholder:text-muted/70 " +
  "transition-colors hover:border-accent/40 aria-invalid:border-danger";

// Validate in the browser with the same schema first (instant feedback, no round trip),
// then let the Server Action validate again and send.
async function validateThenSend(prev: ContactResult, formData: FormData): Promise<ContactResult> {
  const input = readContactForm(formData);
  // A filled honeypot goes straight to the server, which quietly drops it.
  if (!input.website) {
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
    <form ref={formRef} action={formAction} noValidate className="relative space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="name" autoComplete="name" maxLength={NAME_MAX} error={errorFor("name")} defaultValue={state.values?.name} />
        <Field name="email" type="email" autoComplete="email" error={errorFor("email")} defaultValue={state.values?.email} />
      </div>
      <Field name="message" multiline maxLength={MESSAGE_MAX} error={errorFor("message")} defaultValue={state.values?.message} />

      {/* Honeypot: off-screen (not display:none, which some bots skip), out of the tab order,
          hidden from screen readers. Only bots fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden">
        <label htmlFor="contact-website">{contact.honeypotLabel}</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button type="submit" variant="outline" disabled={pending} aria-disabled={pending} className="w-full shrink-0 sm:w-auto">
          {pending ? (
            <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
          ) : (
            <Send className="size-4" aria-hidden="true" />
          )}
          {pending ? contact.sending : contact.submit}
        </Button>
        {/* Announced to screen readers when it changes */}
        <p role="status" aria-live="polite" className={cn("text-sm", state.ok ? "text-success" : "text-danger")}>
          {state.message}
        </p>
      </div>
    </form>
  );
}
