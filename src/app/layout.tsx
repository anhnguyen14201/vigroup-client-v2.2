import { Marcellus, Montserrat } from 'next/font/google'
import { getMessages } from 'next-intl/server'
import { NextIntlClientProvider } from 'next-intl'

import './globals.css'

const marcellus = Marcellus({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-marcellus',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat',
})

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const messages = await getMessages({ locale })
  return (
    <html lang={locale || 'vi'} suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${marcellus.variable} ${montserrat.variable} antialiased`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <main>
            {/* ĐÂY LÀ THẺ CÒN THIẾU */}
            {children}
          </main>{' '}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
