"use client"

import { Play } from "lucide-react"
import type { ChapterData, SubjectData } from "./subject-detail"

export default function ChapterDetail({
  subjectName,
  subject,
  chapter,
}: {
  subjectName: string
  subject: SubjectData
  chapter: ChapterData
}) {
  const heading = (text: string) => (
    <div className="text-[11px] font-extrabold uppercase tracking-wide text-gray-600 mb-2">{text}</div>
  )

  const getScoreText = (t: { percent?: number; score?: string }) => {
    if (typeof t.percent === "number") return `${Math.round(t.percent / 10)}/10`
    if (t.score) return t.score
    return "—"
  }

  const isBad = (t: { percent?: number; score?: string }) => {
    if (typeof t.percent === "number") return t.percent < 70
    if (t.score && /^(\d+)\/(\d+)$/.test(t.score)) {
      const [, a, b] = t.score.match(/^(\d+)\/(\d+)$/) as RegExpMatchArray
      const pct = (Number(a) / Number(b)) * 100
      return pct < 70
    }
    return false
  }

  return (
    <div className="p-4 pb-24">
      {/* Hero Card - Chapter centered like subject slide */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm mb-4">
        <div className="text-center">
          <div className="text-base font-semibold text-gray-800 mb-1">{chapter.name}</div>
          <div className="text-4xl font-extrabold text-[#48319d]">{chapter.score}%</div>
          <div className="text-xs text-gray-500 mt-0.5">Avg. Score</div>
        </div>
      </div>

      {/* Class Statistics */}
      {heading("Class Statistics")}
      <div className="grid grid-cols-3 gap-2 mb-5">
        <div className="rounded-xl bg-blue-50 text-center p-2.5 shadow-sm">
          <div className="text-[11px] text-gray-600 mb-0.5">Total Classes</div>
          <div className="text-lg font-extrabold text-gray-900">{chapter.classStats?.totalClasses ?? 0}</div>
        </div>
        <div className="rounded-xl bg-emerald-50 text-center p-2.5 shadow-sm">
          <div className="text-[11px] text-gray-600 mb-0.5">Attended</div>
          <div className="text-lg font-extrabold text-gray-900">{chapter.classStats?.attended ?? 0}</div>
        </div>
        <div className="rounded-xl bg-amber-50 text-center p-2.5 shadow-sm">
          <div className="text-[11px] text-gray-600 mb-0.5">Absent</div>
          <div className="text-lg font-extrabold text-gray-900">{chapter.classStats?.absent ?? 0}</div>
        </div>
      </div>

      {/* Live MCQ Score */}
      {heading("Live MCQ Score")}
      <div className="flex flex-col gap-2 mb-5">
        {chapter.mcqTopics.map((t) => (
          <div key={t.name} className="flex items-center justify-between border border-gray-200 bg-white rounded-xl p-2.5 shadow-sm">
            <span className="text-sm text-gray-800">{t.name}</span>
            <span className={`text-sm font-semibold ${isBad(t) ? "text-rose-600" : "text-gray-900"}`}>{getScoreText(t)}</span>
          </div>
        ))}
      </div>

      {/* Live CQ Score */}
      {heading("Live CQ Score")}
      <div className="flex flex-col gap-2 mb-5">
        {chapter.cqTopics.map((t) => (
          <div key={t.name} className="flex items-center justify-between border border-gray-200 bg-white rounded-xl p-2.5 shadow-sm">
            <span className="text-sm text-gray-800">{t.name}</span>
            <span className={`text-sm font-semibold ${isBad(t) ? "text-rose-600" : "text-gray-900"}`}>{getScoreText(t)}</span>
          </div>
        ))}
      </div>

      {/* Key Weak Areas */}
      {heading("Key Weak Areas")}
      <div className="flex flex-wrap gap-2 mb-5">
        {(chapter.weakAreas ?? []).map((w) => (
          <span key={w} className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-600 border border-rose-100">
            {w}
          </span>
        ))}
      </div>

      {/* Recommended Videos */}
      {heading("Recommended Videos")}
      <div className="flex flex-col gap-2">
        {(chapter.recommendedVideos ?? []).map((v) => (
          <div key={v} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200 shadow-sm">
            <span className="text-sm font-medium text-gray-800">{v}</span>
            <span className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
              <Play className="w-4 h-4" />
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}


