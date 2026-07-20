import { useState, useRef, useEffect, useMemo } from 'react'

interface SwirlBorderProps {
  active: boolean
  // We no longer need a single radius prop since the shape is fixed
}

export const SwirlBorder = ({ active }: SwirlBorderProps) => {
  const [rectSize, setRectSize] = useState({ w: 0, h: 0 })
  const [pathLength, setPathLength] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)

  // Update size on mount and when active changes
  useEffect(() => {
    if (containerRef.current) {
      setRectSize({
        w: containerRef.current.offsetWidth,
        h: containerRef.current.offsetHeight
      })
    }
  }, [active])

  // Generate the path data for the asymmetrical bubble: [24, 24, 24, 4]
  const d = useMemo(() => {
    const { w, h } = rectSize
    if (w === 0 || h === 0) return ""
    
    const rLarge = 24
    const rSmall = 4

    // Drawing a path that matches rounded-[24px_24px_24px_4px]
    return `
      M ${rLarge},0 
      H ${w - rLarge} 
      A ${rLarge},${rLarge} 0 0 1 ${w},${rLarge} 
      V ${h - rLarge} 
      A ${rLarge},${rLarge} 0 0 1 ${w - rLarge},${h} 
      H ${rSmall} 
      A ${rSmall},${rSmall} 0 0 1 0,${h - rSmall} 
      V ${rLarge} 
      A ${rLarge},${rLarge} 0 0 1 ${rLarge},0 
      Z
    `
  }, [rectSize])

  // Measure the exact length of the custom path for the animation
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
            stroke="#B31922"
            strokeWidth="3"
            strokeDasharray={pathLength}
            strokeDashoffset={active ? 0 : pathLength}
            className={
              active 
                ? "[transition:stroke-dashoffset_0.8s_cubic-bezier(0.4,0,0.2,1)]" 
                : "[transition:stroke-dashoffset_0.8s_ease-in]"
            }
          />
        </svg>
      )}
    </div>
  )
}