import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn, isExternal } from "@/lib/utils";

type Variant = "gradient" | "outline" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium " +
  "transition-all duration-200 hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  gradient:
    "text-white shadow-lg shadow-accent/20 hover:shadow-accent/40 [background-image:var(--gradient-brand)]",
  outline: "border border-accent/60 text-accent hover:border-accent hover:bg-accent/10",
  ghost: "text-text hover:bg-bg-raised hover:text-accent",
};

interface CommonProps {
  variant?: Variant;
  className?: string;
  children: ReactNode;
}

type LinkButtonProps = CommonProps & {
  href: string;
  download?: boolean;
  "aria-label"?: string;
};

type NativeButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & { href?: undefined };

export type ButtonProps = LinkButtonProps | NativeButtonProps;

export function Button(props: ButtonProps) {
  const classes = cn(base, variants[props.variant ?? "gradient"], props.className);

  if (props.href !== undefined) {
    const { href, download, children, "aria-label": ariaLabel } = props;

    if (isExternal(href)) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel} className={classes}>
          {children}
        </a>
      );
    }

    // mailto:, tel: and static files (resume.pdf) are not app routes, so skip next/link.
    if (/^(mailto:|tel:)/.test(href) || download || /\.\w+$/.test(href)) {
      return (
        <a href={href} download={download} aria-label={ariaLabel} className={classes}>
          {children}
        </a>
      );
    }

    return (
      <Link href={href} aria-label={ariaLabel} className={classes}>
        {children}
      </Link>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { variant, className, children, href, type = "button", ...rest } = props;
  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}
