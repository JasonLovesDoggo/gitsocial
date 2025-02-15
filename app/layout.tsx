import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GitSocial',
  description: 'A GitHub repository card generator with themes and styles',
  authors: ['@JasonLovesDoggo'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
