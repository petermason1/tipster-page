import '../styles/globals.css'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

export const metadata = {
  title: 'Horse Tips',
  description: 'Get smart with your racing bets',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main style={{ padding: '2rem', minHeight: '80vh' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
