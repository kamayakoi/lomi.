import { useTheme } from '@/lib/hooks/useTheme'

export function ProductHuntBadge() {
    const { theme } = useTheme()
    const isDark = theme === 'dark'

    return (
        <a
            href="https://www.producthunt.com/posts/psychoroid-com?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-psychoroid-com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
        >
            <img
                src={`https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=425252&theme=${isDark ? 'dark' : 'light'}`}
                alt="psychoroid.com - Turn prompts and images into production-ready 3D models | Product Hunt"
                width={250}
                height={54}
                style={{
                    width: '410px',
                    height: '80px'
                }}
            />
        </a>
    )
}