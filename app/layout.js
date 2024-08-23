import { Inter } from 'next/font/google'
import { Providers } from "./providers";
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Resolutions',
  description: 'New Years Resolution tracker app to make sure you and your friends acheieve your goals',
  metadataBase: new URL('https://resolutions-ochre.vercel.app/')
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className='dark'>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}