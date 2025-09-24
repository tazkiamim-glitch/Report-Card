import type React from "react"
interface ProgressRingProps {
  percentage: number
  size: number
  color: string
  multiColor?: boolean
  children?: React.ReactNode
}

export function ProgressRing({ percentage, size, color, multiColor = false, children }: ProgressRingProps) {
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const getGradient = () => {
    if (multiColor) {
      return `conic-gradient(#2ECC71 0% 40%, #E74C3C 40% 60%, ${color} 60% ${percentage}%, #ECECF2 ${percentage}% 100%)`
    }
    return `conic-gradient(${color} 0% ${percentage}%, #ECECF2 ${percentage}% 100%)`
  }

  return (
    <div
      className="rounded-full flex items-center justify-center relative"
      style={{
        width: size,
        height: size,
        background: getGradient(),
      }}
    >
      <div
        className="bg-white rounded-full flex items-center justify-center"
        style={{
          width: size * 0.8,
          height: size * 0.8,
        }}
      >
        {children}
      </div>
    </div>
  )
}
