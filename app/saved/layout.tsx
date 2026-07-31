import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Nunito, Nunito_Sans } from 'next/font/google'
import './globals.css'

const nunito = Nunito({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-heading',
  display: 'swap',
})

const nunitoSans = Nunito_Sans({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Từ vựng đã lưu · LingoLearn',
  description:
    'Xem lại các thư mục và từ vựng bạn đã lưu trong LingoLearn, kèm hình ảnh gốc đã chụp.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#16a34a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className={`bg-background ${nunito.variable} ${nunitoSans.variable}`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
