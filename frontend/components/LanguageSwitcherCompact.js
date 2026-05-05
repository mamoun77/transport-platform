import { useRouter } from 'next/router'

export default function LanguageSwitcherCompact() {
  const router = useRouter()

  const changeLanguage = (locale) => {
    router.push(router.asPath, router.asPath, { locale })
  }

  return (
    <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full p-1 border border-white/20">
      <button
        onClick={() => changeLanguage('fr')}
        className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
          router.locale === 'fr' 
            ? 'bg-white text-blue-600 shadow-sm' 
            : 'text-gray-600 hover:text-blue-600 hover:bg-white/20'
        }`}
      >
        🇫🇷 FR
      </button>
      <button
        onClick={() => changeLanguage('en')}
        className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
          router.locale === 'en' 
            ? 'bg-white text-blue-600 shadow-sm' 
            : 'text-gray-600 hover:text-blue-600 hover:bg-white/20'
        }`}
      >
        🇬🇧 EN
      </button>
    </div>
  )
}