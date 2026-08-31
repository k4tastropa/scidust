import { ImageResponse } from "next/og"

export const runtime = "nodejs"
export const alt = "Tatia / Scidust9 — 3D Artist & Digital Sculptor | Tbilisi, Georgia"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#051519",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          position: "relative",
          fontFamily: "sans-serif",
          color: "#e2fffb",
          border: "1px solid rgba(127,245,237,0.2)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              fontSize: 18,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#8ce7e1",
            }}
          >
            Tatia / Scidust9
          </div>
          <div
            style={{
              fontSize: 16,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#8ce7e1",
            }}
          >
            3D CGI / Tbilisi, GE
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: "900",
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
              textTransform: "uppercase",
              color: "#e2fffb",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Anatomy</span>
            <span>After Human.</span>
          </div>
          <div
            style={{
              fontSize: 22,
              color: "#9af6ef",
              maxWidth: "700px",
              lineHeight: 1.4,
              display: "flex",
            }}
          >
            Surreal biomechanical worlds, visceral anatomies, and cinematic CGI concepts.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "1px solid rgba(117,217,211,0.3)",
            paddingTop: "24px",
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: "bold",
              letterSpacing: "0.05em",
              color: "#e2fffb",
            }}
          >
            scidust.art
          </div>
          <div
            style={{
              fontSize: 14,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(140,231,225,0.7)",
            }}
          >
            Selected 3D Works & Archive
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
