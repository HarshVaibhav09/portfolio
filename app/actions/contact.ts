"use server";

import { headers } from "next/headers";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { Resend } from "resend";
import { contact, notificationEmail } from "@/lib/content";
import { buildContactEmail } from "@/lib/email/contact-email";
import {
  contactSchema,
  invalidResult,
  readContactForm,
  type ContactFormInput,
  type ContactResult,
} from "@/lib/schemas/contact";

const REQUIRED_ENV = [
  "RESEND_API_KEY",
  "CONTACT_TO_EMAIL",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
] as const;

type ContactEnv = Record<(typeof REQUIRED_ENV)[number], string>;

const success: ContactResult = { ok: true, message: contact.success };

/** Failure that keeps what the visitor typed (React resets the form after every submit). */
function fail(message: string, input: ContactFormInput): ContactResult {
  return { ok: false, message, values: { name: input.name, email: input.email, message: input.message } };
}

// One limiter per server instance. Created lazily, after the env check has passed.
let ratelimit: Ratelimit | undefined;

function getRatelimit(url: string, token: string): Ratelimit {
  ratelimit ??= new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(3, "10 m"),
    // The Redis database may be shared with another project, so namespace every key.
    prefix: "portfolio:contact",
    // If Redis does not answer within 3s the request is allowed rather than hanging the form.
    timeout: 3000,
  });
  return ratelimit;
}

/** All required env vars, or null (after logging which ones are missing). */
function readEnv(): ContactEnv | null {
  const read = (key: keyof ContactEnv): string => process.env[key]?.trim() ?? "";
  const env: ContactEnv = {
    RESEND_API_KEY: read("RESEND_API_KEY"),
    CONTACT_TO_EMAIL: read("CONTACT_TO_EMAIL"),
    UPSTASH_REDIS_REST_URL: read("UPSTASH_REDIS_REST_URL"),
    UPSTASH_REDIS_REST_TOKEN: read("UPSTASH_REDIS_REST_TOKEN"),
  };
  const missing = REQUIRED_ENV.filter((key) => !env[key]);
  if (missing.length > 0) {
    console.error(`[contact] missing environment variables: ${missing.join(", ")}`);
    return null;
  }
  return env;
}

/**
 * Rate-limit key: the client IP. Trust assumption: on Vercel, x-forwarded-for and x-real-ip are
 * set by the platform (client-sent values are overwritten), so they cannot be spoofed. On a host
 * without that guarantee, the leftmost x-forwarded-for entry would be client-controlled.
 */
async function clientKey(): Promise<string> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip")?.trim();
  // No IP at all (unusual): everyone in that state shares one bucket instead of being unlimited.
  return ip ? `ip:${ip}` : "ip:unknown";
}

export async function sendContact(_prev: ContactResult, formData: FormData): Promise<ContactResult> {
  const input = readContactForm(formData);

  // 1. Honeypot filled: pretend it worked so the bot learns nothing, but send nothing.
  if (input.honeypot) {
    console.warn("[contact] honeypot filled, submission dropped");
    return success;
  }

  // 2. Same schema as the form. Runs before rate limiting so typos do not use up quota.
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) return invalidResult(parsed.error, input);
  const { name, email, message } = parsed.data;

  // 3. Misconfiguration: say so loudly in the server log, politely to the visitor.
  const env = readEnv();
  if (!env) return fail(contact.errors.unavailable, input);

  // 4. Rate limit: 3 messages per 10 minutes per IP.
  try {
    const { success: allowed, reset } = await getRatelimit(
      env.UPSTASH_REDIS_REST_URL,
      env.UPSTASH_REDIS_REST_TOKEN,
    ).limit(await clientKey());
    if (!allowed) {
      const minutes = Math.max(1, Math.ceil((reset - Date.now()) / 60_000));
      return fail(contact.errors.rateLimited.replace("{minutes}", String(minutes)), input);
    }
  } catch (error) {
    // Bad credentials or Redis errors: fail closed so a broken limiter gets noticed.
    console.error("[contact] rate limiter error", error);
    return fail(contact.errors.unavailable, input);
  }

  // 5. Send. HTML + plain-text versions; every user value is escaped inside buildContactEmail.
  const mail = buildContactEmail({ name, email, message, receivedAt: new Date() });
  try {
    const { error } = await new Resend(env.RESEND_API_KEY).emails.send({
      from: notificationEmail.from,
      to: env.CONTACT_TO_EMAIL,
      replyTo: email,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
    });
    if (error) {
      console.error("[contact] resend error", error);
      return fail(contact.errors.generic, input);
    }
  } catch (error) {
    console.error("[contact] resend threw", error);
    return fail(contact.errors.generic, input);
  }

  return success;
}
