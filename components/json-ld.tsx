import type { Artwork } from "@/lib/artwork"

export function SiteJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Person", "VisualArtist"],
        "@id": "https://scidust.art/#artist",
        name: "Tatia",
        alternateName: [
          "Scidust",
          "Scidust9",
          "Tatia 3D",
          "Tatia Scidust",
          "Tatia Georgia",
        ],
        url: "https://scidust.art",
        image: "https://scidust.art/01.png",
        description:
          "Tatia (Scidust9) is a 3D CGI artist and digital sculptor based in Tbilisi, Georgia, creating surreal biomechanical worlds, visceral anatomies, and futuristic concepts.",
        jobTitle: "3D CGI Artist & Digital Sculptor",
        nationality: {
          "@type": "Country",
          name: "Georgia",
        },
        homeLocation: {
          "@type": "Place",
          name: "Tbilisi, Georgia",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Tbilisi",
            addressCountry: "GE",
          },
        },
        sameAs: [
          "https://www.instagram.com/scidust9/",
          "https://www.behance.net/scidust9",
        ],
        knowsAbout: [
          "3D Art",
          "3D Modeling",
          "CGI Animation & Stills",
          "Biomechanical Art",
          "Surreal 3D Concepts",
          "Digital Sculpture",
          "Dark Sci-Fi Art",
          "Cinema 4D",
          "Blender",
          "ZBrush",
          "Octane Render",
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://scidust.art/#website",
        url: "https://scidust.art",
        name: "Tatia (Scidust9) — 3D Artist Portfolio",
        alternateName: [
          "Scidust",
          "Tatia 3D",
          "Tatia 3D Artist Georgia",
          "Scidust9 Portfolio",
        ],
        description:
          "Official 3D CGI portfolio of Tatia (Scidust9), 3D artist and digital sculptor based in Tbilisi, Georgia. Biomechanical sculptures, surreal anatomies, and CGI concept art.",
        publisher: {
          "@id": "https://scidust.art/#artist",
        },
        inLanguage: "en",
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function ArtworkJsonLd({ artwork }: { artwork: Artwork }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    name: artwork.title,
    artist: {
      "@type": "Person",
      name: "Tatia",
      alternateName: "Scidust9",
      url: "https://scidust.art",
    },
    artMedium: "3D CGI Digital Sculpture",
    artform: "Digital Art",
    dateCreated: artwork.year,
    description: artwork.description,
    image: artwork.images.map((img) => img.src),
    url: `https://scidust.art/gallery/${artwork.id}`,
    creator: {
      "@id": "https://scidust.art/#artist",
    },
    locationCreated: {
      "@type": "Place",
      name: "Tbilisi, Georgia",
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
