import { useState, useRef, useEffect, useMemo } from 'react'

interface SwirlBorderProps {
  active: boolean
  // Accepts custom radii or defaults to a full pill radius
  radii?: [number, number, number, number]
}

export const SwirlBorder = ({ active, radii }: SwirlBorderProps) => {
  const [rectSize, setRectSize] = useState({ w: 0, h: 0 })
  const [pathLength, setPathLength] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)

  const strokeWidth = 2
  const halfStroke = strokeWidth / 2

  useEffect(() => {
    if (!containerRef.current) return

    const updateSize = () => {
      if (containerRef.current) {
        setRectSize({
          w: containerRef.current.offsetWidth,
          h: containerRef.current.offsetHeight
        })
      }
    }

    updateSize()

    const observer = new ResizeObserver(updateSize)
    observer.observe(containerRef.current)

    return () => observer.disconnect()
  }, [])

  const d = useMemo(() => {
    const { w, h } = rectSize
    if (w <= 0 || h <= 0) return ""

    // Calculate maximum possible radius for full pill rounding if not explicitly provided
    const maxPillRadius = Math.min(w, h) / 2
    const [tl, tr, br, bl] = radii 
      ? radii.map(r => Math.min(r, maxPillRadius)) 
      : [maxPillRadius, maxPillRadius, maxPillRadius, maxPillRadius]

    const left = halfStroke
    const top = halfStroke
    const right = w - halfStroke
    const bottom = h - halfStroke

    return `
      M ${left + tl},${top}
      H ${right - tr}
      A ${tr},${tr} 0 0 1 ${right},${top + tr}
      V ${bottom - br}
      A ${br},${br} 0 0 1 ${right - br},${bottom}
      H ${left + bl}
      A ${bl},${bl} 0 0 1 ${left},${bottom - bl}
      V ${top + tl}
      A ${tl},${tl} 0 0 1 ${left + tl},${top}
      Z
    `
  }, [rectSize, radii, halfStroke])

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength())
    }
  }, [d])

  const dashLength = pathLength * 0.35
  const gapLength = pathLength * 0.65

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none z-0 transition-opacity duration-300 ${
        active ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {rectSize.w > 0 && (
        <svg 
          width="100%" 
          height="100%" 
          viewBox={`0 0 ${rectSize.w} ${rectSize.h}`}
          className="block w-full h-full overflow-visible"
        >
          {pathLength > 0 && (
            <style>{`
              @keyframes swirlContinuous {
                0% {
                  stroke-dashoffset: 0;
                }
                100% {
                  stroke-dashoffset: -${pathLength};
                }
              }
            `}</style>
          )}
          <path
            ref={pathRef}
            d={d}
            fill="none"
            stroke="#87000D"
            strokeWidth={strokeWidth}
            strokeDasharray={pathLength ? `${dashLength} ${gapLength}` : undefined}
            style={
              active && pathLength > 0
                ? {
                    animation: 'swirlContinuous 1.2s linear infinite',
                    willChange: 'stroke-dashoffset'
                  }
                : undefined
            }
          />
        </svg>
      )}
    </div>
  )
}