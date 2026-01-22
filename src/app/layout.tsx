import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FinSight",
  description: "Financial Insight Application",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FinSight",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    apple: "/icon.png",
    icon: "/icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="font-sans">
        {/* 바깥: 데스크톱에서 가운데 정렬을 위한 캔버스 */}
        <div className="min-h-dvh w-full bg-black/5 flex justify-center">
          {/* 안쪽: 실제 앱 화면(폭 제한) */}
          <div
            id="app-shell"
            className="w-full max-w-[420px] min-h-dvh bg-bg-90"
          >
            {children}
          </div>
        </div>
      </body>
    </html>
    
  );
}

