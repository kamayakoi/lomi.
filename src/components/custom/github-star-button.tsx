import { Star } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Component() {
    const [starCount, setStarCount] = useState<number>(0)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const repoUrl = 'https://github.com/lomiafrica/lomi-docs'

    useEffect(() => {
        const fetchStarCount = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const response = await fetch('https://api.github.com/repos/lomiafrica/lomi-docs')
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                const data = await response.json()
                setStarCount(data.stargazers_count)
            } catch (err) {
                console.error('Fetch error:', err)
                setError(err instanceof Error ? err.message : 'Failed to fetch star count')
            } finally {
                setIsLoading(false)
            }
        }

        fetchStarCount()
    }, [])

    const handleClick = () => {
        window.open(repoUrl, '_blank', 'noopener,noreferrer')
    }

    if (error) {
        return null
    }

    return (
        <button
            onClick={handleClick}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors rounded-md"
            aria-label={`Star Lomi Docs on GitHub (${starCount} stars)`}
        >
            <Star className="w-4 h-4" />
            <span className="sr-only">Star</span>
            <span>{isLoading ? '...' : new Intl.NumberFormat('en-US').format(starCount)}</span>
        </button>
    )
}