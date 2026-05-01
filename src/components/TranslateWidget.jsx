/**
 * Google Translate Widget component.
 * Embeds the free Google Translate widget to support multiple Indian languages.
 * No API key required.
 */
import { useEffect } from 'react'
import { Languages } from 'lucide-react'

export default function TranslateWidget() {
  useEffect(() => {
    // Inject Google Translate script once
    if (document.getElementById('google-translate-script')) return

    // Define the init callback before script loads
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'hi,ta,bn,mr,te,gu,kn,pa,ml,ur,en',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        'google_translate_element'
      )
    }

    const script = document.createElement('script')
    script.id = 'google-translate-script'
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    script.async = true
    document.body.appendChild(script)
  }, [])

  return (
    <div className="flex items-center gap-1.5" title="Translate this page">
      <Languages size={15} className="text-text-secondary flex-shrink-0" />
      <div
        id="google_translate_element"
        className="translate-widget"
      />
    </div>
  )
}
