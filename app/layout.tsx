import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { RouteRestorer } from '@/components/RouteRestorer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '一段読書 - Knowledge Loop Edition',
  description: '学びを定着させる読書体験。読書内容の記録 → 理解 → 復習が循環するKnowledge Loopを実現します。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4C69K87TN0"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-4C69K87TN0');
          `}
        </Script>
        <div className="min-h-screen bg-gray-50">
          <RouteRestorer />
          {children}
        </div>
      </body>
    </html>
  )
}
