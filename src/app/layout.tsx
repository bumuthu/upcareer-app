import './globals.css'
import type { Metadata } from 'next'
import { GlobalContextProvider } from '../context/GlobalContext'
import AppThemeProvider from '../common/AppThemeProvider'
import { SubscriptionContextProvider } from '../context/SubscriptionContext'
import { AuthContextProvider } from '../context/AuthContext'

export const metadata: Metadata = {
  title: 'UpCareer Labs - Unleash your potential career',
  description: 'Unleash your potential career',
  icons: '/icon-256.svg',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <AuthContextProvider>
          <SubscriptionContextProvider>
            <GlobalContextProvider>
              <AppThemeProvider>
                {children}
              </AppThemeProvider>
            </GlobalContextProvider>
          </SubscriptionContextProvider>
        </AuthContextProvider>
      </body>
    </html>
  )
}
