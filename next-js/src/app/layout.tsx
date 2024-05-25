import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '../components/header'
import { NotificationProvider } from '../contexts/notification_context'
import { verifySession } from '../lib/dal'
import { cookies } from 'next/headers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const token = cookies().get("session")?.value;
  return (
    <html lang="en">
      <body className={inter.className}>
        <NotificationProvider token={token}>
          <Header login={token != null}/>
          {children}
        </NotificationProvider>
      </body>
    </html>
  )
}
