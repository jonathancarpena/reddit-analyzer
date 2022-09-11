import '../styles/globals.css'
import Layout from '../components/Layout'
import DarkModeProvider from '../context/DarkMode'

function MyApp({ Component, pageProps }) {
  return (
    <DarkModeProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </DarkModeProvider>
  )
}

export default MyApp
