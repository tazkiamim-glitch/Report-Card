"use client"

import { useState } from "react"
import { Area, CartesianGrid, Line, ComposedChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { curveCardinal } from "victory-vendor/d3-shape"

const chartData = {
  labels: ["Jan", "Feb", "Mar"],
  attendance: {
    data: [
      { month: "Jan", value: 15 },
      { month: "Feb", value: 38 },
      { month: "Mar", value: 58 },
    ],
    color: "#6B49CD",
  },
  mcq: {
    data: [
      { month: "Jan", value: 45 },
      { month: "Feb", value: 55 },
      { month: "Mar", value: 50 },
    ],
    color: "#FFC94A",
  },
  cq: {
    data: [
      { month: "Jan", value: 30 },
      { month: "Feb", value: 42 },
      { month: "Mar", value: 63 },
    ],
    color: "#2ECC71",
  },
}

export function PerformanceChart() {
  const [activeChart, setActiveChart] = useState<"attendance" | "mcq" | "cq">("attendance")

  return (
    <div>
      {/* Chart Tabs */}
      <div className="flex bg-gray-100 rounded-2xl p-2 mb-4">
        {(["attendance", "mcq", "cq"] as const).map((chart) => (
          <button
            key={chart}
            className={`flex-1 py-2.5 text-center text-sm font-medium rounded-xl transition-all ${
              activeChart === chart ? "bg-white text-purple-700 font-semibold shadow-sm" : "text-gray-500"
            }`}
            onClick={() => setActiveChart(chart)}
          >
            {chart === "attendance" && "Class Attendance"}
            {chart === "mcq" && "MCQ Score"}
            {chart === "cq" && "CQ Score"}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData[activeChart].data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            {/* Gradient fill that matches the active series color */}
            {(() => {
              const gradientId = `gradient-${activeChart}`
              const color = chartData[activeChart].color
              return (
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.38} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.08} />
                  </linearGradient>
                </defs>
              )
            })()}

            <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6B7280" }}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6B7280" }}
              tickFormatter={(value) => `${value}%`}
            />

            <Area
              type={curveCardinal.tension(0.6)}
              dataKey="value"
              stroke="none"
              fill={`url(#gradient-${activeChart})`}
              isAnimationActive={true}
              fillOpacity={1}
            />

            <Line
              type={curveCardinal.tension(0.6)}
              dataKey="value"
              stroke={chartData[activeChart].color}
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              dot={{
                fill: chartData[activeChart].color,
                strokeWidth: 2,
                stroke: "#fff",
                r: 5,
              }}
              activeDot={{
                r: 6,
                stroke: chartData[activeChart].color,
                strokeWidth: 2,
                fill: "#fff",
              }}
              isAnimationActive={true}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
