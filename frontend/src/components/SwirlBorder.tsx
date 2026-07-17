import { useState, useRef, useEffect } from 'react'

interface SwirlBorderProps {
  active: boolean
  radius?: number
}

export const SwirlBorder = ({ active, radius = 20 }: SwirlBorderProps) => {
  const [rectSize, setRectSize] = useState({ w: 0, h: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      setRectSize({
        w: containerRef.current.offsetWidth,
        h: containerRef.current.offsetHeight
      })
    }
  }, [active])

  const perimeter = (rectSize.w + rectSize.h) * 2

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none z-10 transition-opacity duration-400 ease-in-out ${
        active ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {rectSize.w > 0 && (
        <svg width="100%" height="100%" className="overflow-visible">
          <rect
            x="0"
            y="0"
            width={rectSize.w}
            height={rectSize.h}
            fill="none"
            stroke="#B31922"
            strokeWidth="3"
            rx={radius}
            ry={radius}
            strokeDasharray={perimeter}
            strokeDashoffset={active ? 0 : perimeter}
            className="[transition:stroke-dashoffset_0.8s_cubic-bezier(0.4,_0,_0.2,_1)]"
          />
        </svg>
      )}
    </div>
  )
}