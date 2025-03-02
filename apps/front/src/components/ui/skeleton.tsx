interface SkeletonProps {
    className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
    return (
        <div
            className={`skeleton ${className}`}
            style={{
                minHeight: '1rem',
                backgroundColor: '#e2e8f0',
                borderRadius: '0.25rem',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }}
        />
    )
}

// Add this style to your global CSS file or create a new one
const style = `
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}
`

// Inject the style into the document
const styleElement = document.createElement('style')
styleElement.textContent = style
document.head.appendChild(styleElement)