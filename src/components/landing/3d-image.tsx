'use client'

interface ThreeDImageProps {
    src: string
    alt: string
    width: number
    height: number
    className?: string
}

export default function ThreeDImage({
    src,
    alt,
    width,
    height,
    className
}: ThreeDImageProps) {
    return (
        <div className="relative w-fit">
            {/* 3D Transform wrapper */}
            <div className="
        [transform:perspective(4601px)_rotateX(51deg)_rotateY(-27deg)_rotateZ(46deg)]
        [transform-style:preserve-3d]
      ">
                {/* Image wrapper with shadow and 3D borders */}
                <div className="relative [transform-style:preserve-3d]">
                    {/* Main image face */}
                    <div className="
                        relative
                        border-0
                        overflow-hidden
                        [box-shadow:0px_40px_30px_0px_rgba(0,0,0,0.15)]
                        dark:[box-shadow:0px_40px_30px_0px_rgba(0,0,0,0.25)]
                        [backface-visibility:hidden]
                    ">
                        <img
                            src={src}
                            alt={alt}
                            width={width}
                            height={height}
                            className={`w-auto h-auto ${className}`}
                        />
                    </div>

                    {/* Right border face */}
                    <div className="absolute top-0 right-0 w-[60px] h-full bg-[hsl(0,0%,5%)] [transform:translateX(100%)_rotateY(90deg)_translateZ(-30px)] origin-left [backface-visibility:hidden]"></div>

                    {/* Bottom border face */}
                    <div className="absolute -bottom-[1px] left-0 w-full h-[60px] bg-[hsl(0,0%,5%)] [transform:translateY(100%)_rotateX(-90deg)_translateZ(-30px)] origin-top [backface-visibility:hidden]"></div>
                </div>
            </div>
        </div>
    )
}

