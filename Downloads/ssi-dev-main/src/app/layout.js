import Menu from "./components/menu";
import "./globals.scss";

import Script from "next/script";

export const metadata = {
  title: "Soto Servicios Industriales",
  description:
    "Soluciones integrales llave en mano. Alquiler y fabricación de trailers, transporte, catering y logística. SSI ofrece una amplia gama de soluciones en trailers para empresas y particulares que se adaptan a diversas necesidades comerciales y de trabajo.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta
          name="description"
          content="Somos una compañía de servicios dirigidos a satisfacer las necesidades de la actividad industrial y de empresas e instituciones de gran volumen en la región Patagónica."
        />
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
        <meta
          name="google-site-verification"
          content="_Y6_3j9GnIFgxhcEC4oKpEVtQONgPZ_2LS3TPoDF_HQ"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        <Menu />
        {children}
      </body>
    </html>
  );
}
