import localFont from "next/font/local";

const innovatorGrotesk = localFont({
  src: [
    {
      path: "../public/fonts/InnovatorGrotesk/InnovatorGrotesk-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../public/fonts/InnovatorGrotesk/InnovatorGrotesk-ThinItalic.woff2",
      weight: "100",
      style: "italic",
    },
    {
      path: "../public/fonts/InnovatorGrotesk/InnovatorGrotesk-ExtraLight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/fonts/InnovatorGrotesk/InnovatorGrotesk-ExtraLightItalic.woff2",
      weight: "200",
      style: "italic",
    },
    {
      path: "../public/fonts/InnovatorGrotesk/InnovatorGrotesk-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/InnovatorGrotesk/InnovatorGrotesk-LightItalic.woff2",
      weight: "300",
      style: "italic",
    },
    {
      path: "../public/fonts/InnovatorGrotesk/InnovatorGrotesk-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/InnovatorGrotesk/InnovatorGrotesk-RegularItalic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/InnovatorGrotesk/InnovatorGrotesk-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/InnovatorGrotesk/InnovatorGrotesk-MediumItalic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "../public/fonts/InnovatorGrotesk/InnovatorGrotesk-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/InnovatorGrotesk/InnovatorGrotesk-SemiBoldItalic.woff2",
      weight: "600",
      style: "italic",
    },
    {
      path: "../public/fonts/InnovatorGrotesk/InnovatorGrotesk-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/InnovatorGrotesk/InnovatorGrotesk-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
    {
      path: "../public/fonts/InnovatorGrotesk/InnovatorGrotesk-ExtraBold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/fonts/InnovatorGrotesk/InnovatorGrotesk-ExtraBoldItalic.woff2",
      weight: "800",
      style: "italic",
    },
    {
      path: "../public/fonts/InnovatorGrotesk/InnovatorGrotesk-Black.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "../public/fonts/InnovatorGrotesk/InnovatorGrotesk-BlackItalic.woff2",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-innovator",
});

const abcdDiatypeMono = localFont({
  src: [
    {
      path: "../public/fonts/ABCDiatypeMono/ABCDiatypeMono-Thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../public/fonts/ABCDiatypeMono/ABCDiatypeMono-ThinItalic.ttf",
      weight: "100",
      style: "italic",
    },
    {
      path: "../public/fonts/ABCDiatypeMono/ABCDiatypeMono-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/ABCDiatypeMono/ABCDiatypeMono-LightItalic.ttf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../public/fonts/ABCDiatypeMono/ABCDiatypeMono-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/ABCDiatypeMono/ABCDiatypeMono-RegularItalic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/ABCDiatypeMono/ABCDiatypeMono-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/ABCDiatypeMono/ABCDiatypeMono-MediumItalic.ttf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../public/fonts/ABCDiatypeMono/ABCDiatypeMono-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/ABCDiatypeMono/ABCDiatypeMono-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-abcd",
});

export const fontClasses = [innovatorGrotesk, abcdDiatypeMono];
