import { useTheme } from '@/lib/hooks/useTheme'

export function ProductHuntBadge() {
    const { theme } = useTheme()
    const isDark = theme === 'dark'

    return (
        <a
            href="https://www.producthunt.com/posts/lomi?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-lomi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
        >
            <img
                src={`https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=720260&theme=${isDark ? 'dark' : 'light'}&t=1736800231403`}
                alt="lomi. - Simplifying payments across francophone West Africa | Product Hunt"
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