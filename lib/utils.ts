/** Join class names, skipping falsy values. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** True for absolute http(s) URLs, which open in a new tab. */
export function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href);
}
