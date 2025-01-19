'use client'

import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function GitHubStars() {
    const [stars, setStars] = useState<number | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchStars() {
            try {
                const response = await fetch('https://api.github.com/repos/lomiafrica/developers.lomi.africa', {
                    headers: {
                        'Accept': 'application/vnd.github.v3+json',
                        'User-Agent': 'GitHubStars'
                    },
                    cache: 'no-store'
                })

                if (!response.ok) {
                    throw new Error(`GitHub API error: ${response.status}`)
                }

                const data = await response.json()
                setStars(data.stargazers_count)
            } catch (err) {
                console.error('Error fetching stars:', err)
                setError(err instanceof Error ? err.message : 'Failed to fetch stars')
            } finally {
                setIsLoading(false)
            }
        }

        fetchStars()
    }, [])

    const handleClick = () => {
        window.open('https://github.com/lomiafrica/developers.lomi.africa', '_blank', 'noopener,noreferrer')
    }

    return (
        <div className="inline-flex items-center">
            <Button
                variant="secondary"
                size="sm"
                className="gap-2 h-9 px-4"
                disabled={isLoading}
                onClick={handleClick}
            >
                <Star className="h-4 w-4" />
                <span className="text-sm">
                    {isLoading ? 'Loading...' : error ? 'Error' : `Star ${stars ?? 0}`}
                </span>
            </Button>
        </div>
    )
}