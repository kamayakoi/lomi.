import { useState, useEffect } from "react"

const COOKIE_CONSENT_KEY = "cookie-consent-status"

function getCookieConsentStatus() {
    if (typeof window !== "undefined") {
        return localStorage.getItem(COOKIE_CONSENT_KEY)
    }
    return null
}

function setCookieConsentStatus(status: string) {
    if (typeof window !== "undefined") {
        localStorage.setItem(COOKIE_CONSENT_KEY, status)
    }
}

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const status = getCookieConsentStatus()
        if (status === null) {
            setIsVisible(true)
        }
    }, [])

    const handleAccept = () => {
        setCookieConsentStatus("accepted")
        setIsVisible(false)
        // Here you would typically initialize your tracking code
        console.log("Tracking cookies accepted")
    }

    const handleDecline = () => {
        setCookieConsentStatus("declined")
        setIsVisible(false)
        console.log("Tracking cookies declined")
    }

    if (!isVisible) return null

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <div className="w-[370px]">
                <div className="rounded-[6px] bg-black/90 px-5 py-4">
                    <p className="mb-3 text-gray-400 text-sm text-left">
                        We use tracking cookies to understand how you use the product and help us improve it.
                    </p>
                    <div className="flex gap-4">
                        <button onClick={handleAccept} className="text-white text-sm hover:text-gray-200 transition-colors">
                            Accept
                        </button>
                        <button onClick={handleDecline} className="text-gray-500 text-sm hover:text-gray-400 transition-colors">
                            Decline
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
