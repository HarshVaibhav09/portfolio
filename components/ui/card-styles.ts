// Card spec from CLAUDE.md: --bg-alt at 60%, 1px --border, blur 10px; hover = accent border + lift.
// Not a client module, so server components can import it.
export const cardBase = "rounded-2xl border border-border bg-bg-alt/60 backdrop-blur-[10px]";

// Tailwind's -translate-y-* sets the `translate` property (not `transform`), so that is what
// must be transitioned. It also lets the lift coexist with the tilt's inline `transform`.
export const cardClass =
  cardBase +
  " transition-[translate,border-color] duration-300 hover:-translate-y-1 hover:border-accent/40";
