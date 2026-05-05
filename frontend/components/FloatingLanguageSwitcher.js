import { useRouter } from 'next/router'
import { useState } from 'react'

export default function FloatingLanguageSwitcher() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const changeLanguage = (locale) => {
    router.push(router.asPath, router.asPath, { locale })
    setIsOpen(false)
  }

  const languages = {
    fr: { flag: '🇫🇷', code: 'FR' },
    en: { flag: '🇬🇧', code: 'EN' }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-200"
        >
          <span className="text-xl">{languages[router.locale]?.flag}</span>
        </button>

        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute bottom-16 right-0 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden z-20">
              {Object.entries(languages).map(([locale, lang]) => (
                <button
                  key={locale}
                  onClick={() => changeLanguage(locale)}
                  className={`flex items-center space-x-3 px-4 py-3 w-full text-left hover:bg-blue-50 transition-colors ${
                    router.locale === locale ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="font-medium">{lang.code}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}