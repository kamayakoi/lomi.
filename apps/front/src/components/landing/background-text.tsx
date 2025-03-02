interface BackgroundTextProps {
    text: string;
    onClick?: () => void;
}

export function BackgroundText({ text, onClick }: BackgroundTextProps) {

    return (
        <div className="w-full overflow-hidden mt-[-100px] py-[-100px] h-[380px] relative z-0">
            <div
                className="text-[#161616] dark:text-blue-100 text-[500px] leading-none text-center font-bold select-none opacity-10 flex items-baseline justify-center"
                onClick={onClick}
            >
                <span>{text}</span>
                <div className="w-[100px] h-[100px] bg-current ml-4"></div>
            </div>
        </div>
    );
} 