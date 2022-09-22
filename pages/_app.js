import '../styles/globals.css'
import DarkModeProvider from '../context/DarkMode'
import Layout from '../components/Layout'

function MyApp({ Component, pageProps }) {
  return (
    <DarkModeProvider>
      <Component {...pageProps} />
    </DarkModeProvider>
  )
}

export default MyApp
