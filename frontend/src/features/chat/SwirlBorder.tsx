import { useState, useRef, useEffect, useMemo } from 'react'

interface SwirlBorderProps {
  active: boolean
  radii?: [number, number, number, number]
}

export const SwirlBorder = ({ active, radii = [12, 12, 12, 12] }: SwirlBorderProps) => {
  const [rectSize, setRectSize] = useState({ w: 0, h: 0 })
  const [pathLength, setPathLength] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)

  const strokeWidth = 2
  // Inset path by half stroke width so overflow-hidden doesn't clip the outer edge
  const inset = strokeWidth / 2

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

    const [tl, tr, br, bl] = radii
    const wIn = w - inset
    const hIn = h - inset

    return `
      M ${tl + inset},${inset} 
      H ${wIn - tr} 
      A ${tr},${tr} 0 0 1 ${wIn},${tr + inset} 
      V ${hIn - br} 
      A ${br},${br} 0 0 1 ${wIn - br},${hIn} 
      H ${bl + inset} 
      A ${bl},${bl} 0 0 1 ${inset},${hIn - bl} 
      V ${tl + inset} 
      A ${tl},${tl} 0 0 1 ${tl + inset},${inset} 
      Z
    `
  }, [rectSize, radii, inset])

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength())
    }
  }, [d])

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
          className="block w-full h-full"
        >
          {pathLength > 0 && (
            <style>{`
              @keyframes swirlInfinite {
                0% { stroke-dashoffset: ${pathLength}; }
                100% { stroke-dashoffset: 0; }
              }
            `}</style>
          )}
          <path
            ref={pathRef}
            d={d}
            fill="none"
            stroke="#E23B4E"
            strokeWidth={strokeWidth}
            strokeDasharray={pathLength ? `${pathLength * 0.35} ${pathLength * 0.65}` : undefined}
            style={
              active && pathLength > 0
                ? { animation: 'swirlInfinite 1.2s linear infinite' }
                : { strokeDashoffset: pathLength }
            }
          />
        </svg>
      )}
    </div>
  )
}