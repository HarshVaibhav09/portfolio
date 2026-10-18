import { ImageResponse } from "next/og";
import { profile, site } from "@/lib/content";

// Shared renderers for the generated social and app icons (next/og, i.e. Satori).
// Satori supports a subset of CSS: flexbox only, no filter: blur (radial gradients stand in
// for the blurred orbs), and background-clip: text for gradient type. The bundled default font
// is Geist Regular (the site typeface); no bold weight ships locally, so no weights are set.

const NAVY = "#0F0F1E";
const BRAND = "linear-gradient(90deg, #FF8E53 0%, #FF6B6B 50%, #00D4FF 100%)";

export const ogSize = { width: 1200, height: 630 };
export const ogAlt = `${profile.name}, ${profile.role}`;

export function renderOgImage(): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 96px",
          backgroundColor: NAVY,
          // Two soft orb glows: cyan top right, coral bottom left.
          backgroundImage:
            "radial-gradient(circle at 88% 8%, rgba(0, 212, 255, 0.28), transparent 42%), radial-gradient(circle at 8% 96%, rgba(255, 107, 107, 0.28), transparent 45%), radial-gradient(circle at 50% 55%, rgba(255, 217, 61, 0.08), transparent 40%)",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, color: "#A8A8B3", letterSpacing: 6, marginBottom: 24 }}>
          {site.logo}
        </div>
        <div
          style={{
            display: "flex",
            // Shrink to the text width so the gradient spans the name, not the whole row.
            alignSelf: "flex-start",
            fontSize: 112,
            letterSpacing: -3,
            lineHeight: 1.05,
            backgroundImage: BRAND,
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {profile.name}
        </div>
        <div style={{ display: "flex", fontSize: 48, color: "#F5F5F7", marginTop: 24 }}>{profile.role}</div>
        <div style={{ display: "flex", width: 160, height: 6, marginTop: 48, borderRadius: 3, backgroundImage: BRAND }} />
      </div>
    ),
    ogSize,
  );
}

/** "HV" monogram: navy rounded square with the letters in the brand gradient. */
export function renderIcon(size: number): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: NAVY,
          borderRadius: size * 0.22,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: size * 0.56,
            letterSpacing: -size * 0.03,
            backgroundImage: BRAND,
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {site.logo}
        </div>
      </div>
    ),
    { width: size, height: size },
  );
}
