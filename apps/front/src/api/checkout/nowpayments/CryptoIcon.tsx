import React from 'react';

interface CryptoIconProps {
    currency: string;
    className?: string;
}

export function CryptoIcon({ currency, className = "" }: CryptoIconProps) {
    // Fallback colors for currencies without images
    const fallbackColors: Record<string, string> = {
        btc: '#F7931A',
        eth: '#627EEA',
        usdt: '#26A17B',
        usdc: '#2775CA',
        dai: '#F5AC37',
        sol: '#00FFA3',
        bnb: '#F3BA2F',
        matic: '#8247E5',
        doge: '#C3A634',
        ada: '#0033AD',
        xrp: '#23292F',
        trx: '#EF0027',
        link: '#2A5ADA',
        fil: '#0090FF',
        ton: '#0098EA',
        xtz: '#A6E000',
        ftm: '#1969FF',
        zec: '#ECB244'
    };

    const code = currency.toLowerCase();
    const imageUrl = `/crypto/${code}.webp`;

    // Check if image exists
    const [imageExists, setImageExists] = React.useState(true);

    React.useEffect(() => {
        const img = new Image();
        img.src = imageUrl;
        img.onload = () => setImageExists(true);
        img.onerror = () => setImageExists(false);
    }, [imageUrl]);

    if (!imageExists) {
        // Fallback to colored circle with first letter
        const bgColor = fallbackColors[code] || '#7A7A7A';
        return (
            <div
                className={`rounded-full w-5 h-5 flex items-center justify-center text-white flex-shrink-0 ${className}`}
                style={{ backgroundColor: bgColor }}
            >
                <span className="text-xs font-bold">{currency.substring(0, 1).toUpperCase()}</span>
            </div>
        );
    }

    return (
        <div className={`w-5 h-5 flex-shrink-0 ${className}`}>
            <img
                src={imageUrl}
                alt={`${currency.toUpperCase()} icon`}
                className="w-full h-full object-contain rounded-full"
            />
        </div>
    );
} 