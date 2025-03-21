import Script from "next/script";

export const metadata = {
  title: "Alquiler de Trailers y Módulos para Empresas",
  description:
    "Ofrecemos trailers y módulos en alquiler para empresas. Soluciones rápidas y eficientes con comodidades modernas para tus necesidades temporales.",
  keywords:
    "alquiler de trailers, módulos para empresas, soluciones temporales, comodidades modernas, trailers en alquiler",

  openGraph: {
    description:
      "Ofrecemos trailers y módulos en alquiler para empresas. Soluciones rápidas y eficientes con comodidades modernas para tus necesidades temporales.",
    keywords:
      "alquiler de trailers, módulos para empresas, soluciones temporales, comodidades modernas, trailers en alquiler",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Soto Servicios Industriales",
      },
    ],
  },
  // Estas verificaciones ayudan a indexar mejor
  verification: {
    google: "_Y6_3j9GnIFgxhcEC4oKpEVtQONgPZ_2LS3TPoDF_HQ",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        {/* Google Analytics script */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
