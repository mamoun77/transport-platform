import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { useState } from 'react'

export default function LanguageSwitcher() {
  const router = useRouter()
  const { t } = useTranslation('common')
  const [isOpen, setIsOpen] = useState(false)

  const changeLanguage = (locale) => {
    router.push(router.asPath, router.asPath, { locale })
    setIsOpen(false)
  }

  const languages = {
    fr: { name: 'Français', flag: '🇫🇷', code: 'FR' },
    en: { name: 'English', flag: '🇬🇧', code: 'EN' }
  }

  const currentLang = languages[router.locale]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-200 group"
      >
        <span className="text-lg">{currentLang?.flag}</span>
        <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
          {currentLang?.code}
        </span>
        <svg 
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full right-0 mt-2 w-48 bg-white/95 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl z-20 overflow-hidden">
            {Object.entries(languages).map(([locale, lang]) => (
              <button
                key={locale}
                onClick={() => changeLanguage(locale)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-blue-50 transition-colors duration-150 ${
                  router.locale === locale 
                    ? 'bg-blue-50 text-blue-600 font-medium' 
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium">{lang.name}</div>
                  <div className="text-xs text-gray-500">{lang.code}</div>
                </div>
                {router.locale === locale && (
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}