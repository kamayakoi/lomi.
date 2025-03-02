import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"

export default function BusinessOutreach() {
    const [isVisible, setIsVisible] = useState(false)
    const { t } = useTranslation()

    useEffect(() => {
        // Show the modal after 5 seconds
        const showTimeout = setTimeout(() => {
            setIsVisible(true)
        }, 5000)

        // Hide it after 1 minute of being shown
        const hideTimeout = setTimeout(() => {
            setIsVisible(false)
        }, 60000)

        return () => {
            clearTimeout(showTimeout)
            clearTimeout(hideTimeout)
        }
    }, [])

    if (!isVisible) return null

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <div className="w-[calc(100vw-100px)] max-w-[345px]">
                <div className="rounded-[6px] bg-black/90 px-4 py-3 sm:px-5 sm:py-4">
                    <p className="mb-2 sm:mb-3 text-gray-400 text-xs sm:text-sm text-left">
                        {t("components.business_outreach.message")}
                    </p>
                    <div className="flex flex-wrap gap-3 sm:gap-4 mt-4">
                        <button
                            onClick={() => window.open('https://cal.com/babacar-diop/30min', '_blank')}
                            className="text-white text-xs sm:text-sm hover:text-gray-200 transition-colors"
                        >
                            {t("components.business_outreach.reach_out")}
                        </button>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="text-gray-500 text-xs hover:text-gray-400 transition-colors"
                        >
                            {t("components.business_outreach.dismiss")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
} 