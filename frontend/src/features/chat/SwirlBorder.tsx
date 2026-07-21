import { useState, useRef, useEffect, useMemo } from 'react'

interface SwirlBorderProps {
  active: boolean
  // Add radii prop to match the MessageBubble's [16, 16, 16, 3]
  radii?: [number, number, number, number] 
}

export const SwirlBorder = ({ active, radii = [16, 16, 16, 3] }: SwirlBorderProps) => {
  const [rectSize, setRectSize] = useState({ w: 0, h: 0 })
  const [pathLength, setPathLength] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)

  // Scale down stroke width from 3 to 2 for the 67% zoom look
  const strokeWidth = 2

  useEffect(() => {
    if (containerRef.current) {
      setRectSize({
        w: containerRef.current.offsetWidth,
        h: containerRef.current.offsetHeight
      })
    }
  }, [active])

  const d = useMemo(() => {
    const { w, h } = rectSize
    if (w === 0 || h === 0) return ""
    
    // Use the provided radii (defaulted to the scaled 16px/3px)
    const [tl, tr, br, bl] = radii

    // Accurate path for asymmetrical corners
    return `
      M ${tl},0 
      H ${w - tr} 
      A ${tr},${tr} 0 0 1 ${w},${tr} 
      V ${h - br} 
      A ${br},${br} 0 0 1 ${w - br},${h} 
      H ${bl} 
      A ${bl},${bl} 0 0 1 0,${h - bl} 
      V ${tl} 
      A ${tl},${tl} 0 0 1 ${tl},0 
      Z
    `
  }, [rectSize, radii])

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength())
    }
  }, [d])

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none z-10 transition-opacity ease-in-out ${
        active ? 'opacity-100 duration-400' : 'opacity-0 duration-200'
      }`}
    >
      {rectSize.w > 0 && (
        <svg 
          width="100%" 
          height="100%" 
          viewBox={`0 0 ${rectSize.w} ${rectSize.h}`}
          className="overflow-visible"
        >
          <path
            ref={pathRef}
            d={d}
            fill="none"
            stroke="#E23B4E" // Using brand red for consistency
            strokeWidth={strokeWidth}
            strokeDasharray={pathLength}
            strokeDashoffset={active ? 0 : pathLength}
            className={
              active 
                ? "[transition:stroke-dashoffset_0.8s_cubic-bezier(0.4,0,0.2,1)]" 
                : "[transition:stroke-dashoffset_0.5s_ease-in]"
            }
          />
        </svg>
      )}
    </div>
  )
}