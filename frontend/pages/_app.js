import '../styles/globals.css'
import '../styles/responsive.css'
import { appWithTranslation } from 'next-i18next'
import { CurrencyProvider } from '../hooks/useCurrency'

function App({ Component, pageProps }) {
  return (
    <CurrencyProvider>
      <Component {...pageProps} />
    </CurrencyProvider>
  )
}

export default appWithTranslation(App)
