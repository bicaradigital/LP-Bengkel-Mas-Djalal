import type React from "react"
import type { Metadata } from "next"
import { Arimo } from "next/font/google"
import "./globals.css"

const arimo = Arimo({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Bengkel Motor Mas Djalal | Servis Motor Terbaik Semarang",
  description:
    "Bengkel Motor Mas Djalal melayani servis ringan, ganti oli, tune-up, dan perawatan motor terbaik di Semarang. Teknisi berpengalaman 15+ tahun. Booking mudah via WhatsApp.",
  keywords:
    "bengkel motor semarang, servis motor, tune-up motor, ganti oli motor, bengkel mas djalal, servis motor semarang, bengkel motor gajahmungkur, perbaikan motor semarang",
  authors: [{ name: "Bengkel Motor Mas Djalal" }],
  creator: "Bengkel Motor Mas Djalal",
  publisher: "Bengkel Motor Mas Djalal",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://bengkel-motor-mas-djalal.vercel.app",
    title: "Bengkel Motor Mas Djalal | Servis Motor Terbaik Semarang",
    description:
      "Bengkel Motor Mas Djalal melayani servis ringan, ganti oli, tune-up, dan perawatan motor terbaik di Semarang. Teknisi berpengalaman 15+ tahun.",
    siteName: "Bengkel Motor Mas Djalal",
    images: [
      {
        url: "/images/bengkel-exterior.png",
        width: 1200,
        height: 630,
        alt: "Bengkel Motor Mas Djalal - Tampak Depan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bengkel Motor Mas Djalal | Servis Motor Terbaik Semarang",
    description:
      "Bengkel Motor Mas Djalal melayani servis ringan, ganti oli, tune-up, dan perawatan motor terbaik di Semarang.",
    images: ["/images/bengkel-exterior.png"],
  },
  alternates: {
    canonical: "https://bengkel-motor-mas-djalal.vercel.app",
  },
  other: {
    "geo.region": "ID-JT",
    "geo.placename": "Semarang",
    "geo.position": "-7.005145;110.438125",
    ICBM: "-7.005145, 110.438125",
  },
    generator: 'v0.app'
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoRepair",
  name: "Bengkel Motor Mas Djalal",
  description:
    "Bengkel Motor Mas Djalal melayani servis ringan, ganti oli, tune-up, dan perawatan motor terbaik di Semarang dengan teknisi berpengalaman 15+ tahun.",
  url: "https://bengkel-motor-mas-djalal.vercel.app",
  telephone: "+62-899-3992-095",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Jl. Ngaglik Baru No.09, Bendungan",
    addressLocality: "Gajahmungkur",
    addressRegion: "Semarang",
    postalCode: "50232",
    addressCountry: "ID",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -7.005145,
    longitude: 110.438125,
  },
  openingHours: ["Mo-Sa 08:00-17:00", "Su 08:00-15:00"],
  priceRange: "$$",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "150",
  },
  serviceArea: {
    "@type": "City",
    name: "Semarang",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Layanan Servis Motor",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Servis Ringan Motor",
          description: "Perawatan rutin motor untuk performa optimal",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Ganti Oli Motor",
          description: "Penggantian oli berkualitas dengan harga terjangkau",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Tune-Up Motor",
          description: "Optimalisasi performa mesin motor",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Servis Elektrik Motor",
          description: "Perbaikan sistem kelistrikan dan lampu motor",
        },
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffcc00" />
      </head>
      <body className={arimo.className}>{children}</body>
    </html>
  )
}
