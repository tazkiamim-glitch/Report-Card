"use client"

import { ChevronRight } from "lucide-react"

type TopicScore = { name: string; percent?: number; score?: string }

export interface ChapterData {
  name: string
  score: number
  hint: string
  classStats?: { totalClasses: number; attended: number; absent: number }
  mcqTopics: TopicScore[]
  cqTopics: TopicScore[]
  weakAreas?: string[]
  recommendedVideos?: string[]
}

export interface SubjectData {
  score: number
  topperScore: number
  percentile: number
  attendance: { percent: number; attended: number; total: number }
  mcq: { percent: number; attended: number; total: number; skipped: number; correct: number; incorrect: number }
  cq: { percent: number; attended: number; total: number }
  chapters: ChapterData[]
}

export default function SubjectDetail({
  subjectName,
  subject,
  onChapterClick,
}: {
  subjectName: string
  subject: SubjectData
  onChapterClick: (chapterName: string) => void
}) {
  const attendancePct = subject.attendance.total
    ? Math.round((subject.attendance.attended / subject.attendance.total) * 100)
    : 0

  const mcqTotal = subject.mcq.total
  const mcqCorrect = subject.mcq.correct
  const mcqIncorrect = subject.mcq.incorrect
  const mcqSkipped = subject.mcq.skipped

  const mcqCorrectPct = mcqTotal ? (mcqCorrect / mcqTotal) * 100 : 0
  const mcqIncorrectPct = mcqTotal ? (mcqIncorrect / mcqTotal) * 100 : 0
  const mcqSkippedPct = mcqTotal ? (mcqSkipped / mcqTotal) * 100 : 0

  const cqPct = subject.cq.percent

  const good = subject.chapters.filter((c) => c.score >= 85)
  const moderate = subject.chapters.filter((c) => c.score >= 70 && c.score < 85)
  const needs = subject.chapters.filter((c) => c.score < 70)

  const SectionHeader = ({ title, count, color }: { title: string; count: number; color: string }) => (
    <div className="flex items-center justify-between mb-2 mt-6">
      <div className={`text-sm font-semibold ${color}`}>{title}</div>
      <span className="px-2.5 py-0.5 rounded-full text-[11px] bg-gray-100 text-gray-600 font-medium">{count}</span>
    </div>
  )

  const ChapterChip = ({ c }: { c: ChapterData }) => {
    const badgeColor = c.score >= 85 ? "bg-emerald-50 text-emerald-600" : c.score >= 70 ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"
    return (
      <div
        className="relative bg-white border border-gray-200 rounded-xl p-3.5 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors ring-1 ring-transparent hover:ring-purple-100"
        onClick={() => onChapterClick(c.name)}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-gray-800 truncate">{c.name}</div>
            <div className="text-xs text-gray-500 mt-0.5 truncate">{c.hint}</div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-xs font-semibold rounded-full px-2 py-0.5 ${badgeColor}`}>{c.score}%</span>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 pb-24">
      {/* Hero card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm mb-4">
        <div className="text-center">
          <div className="text-base font-semibold text-gray-800 mb-1">{subjectName}</div>
          <div className="text-4xl font-extrabold text-[#48319d]">{subject.score}%</div>
        </div>
      </div>

      {/* Compact metrics */}
      <div className="grid grid-cols-3 gap-3">
        {/* Attendance */}
        <div className="bg-white border border-gray-200 rounded-2xl p-3.5 shadow-sm text-center">
          <div className="text-sm font-semibold text-emerald-600">{attendancePct}%</div>
          <div className="mt-2 h-1.5 w-full bg-emerald-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500" style={{ width: `${attendancePct}%` }} />
          </div>
          <div className="mt-1 text-[11px] text-gray-500">
            {subject.attendance.attended}/{subject.attendance.total} Classes
          </div>
        </div>

        {/* MCQ */}
        <div className="bg-white border border-gray-200 rounded-2xl p-3.5 shadow-sm text-center">
          <div className="text-sm font-semibold text-indigo-600">{subject.mcq.percent}%</div>
          <div className="mt-2 h-1.5 w-full rounded-full overflow-hidden flex bg-gray-100">
            <div className="h-full bg-emerald-500" style={{ width: `${mcqCorrectPct}%` }} />
            <div className="h-full bg-rose-400" style={{ width: `${mcqIncorrectPct}%` }} />
            <div className="h-full bg-gray-300" style={{ width: `${mcqSkippedPct}%` }} />
          </div>
          <div className="mt-1 text-[11px] text-gray-500">
            {subject.mcq.attended}/{subject.mcq.total} Exams
          </div>
        </div>

        {/* CQ */}
        <div className="bg-white border border-gray-200 rounded-2xl p-3.5 shadow-sm text-center">
          <div className="text-sm font-semibold text-purple-600">{cqPct}%</div>
          <div className="mt-2 h-1.5 w-full bg-purple-100 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500" style={{ width: `${cqPct}%` }} />
          </div>
          <div className="mt-1 text-[11px] text-gray-500">
            {subject.cq.attended}/{subject.cq.total} Exams
          </div>
        </div>
      </div>

      {/* Chapter Insights */}
      <div className="mt-6">
        <div className="text-base font-semibold text-gray-800 mb-2">Chapter Insights</div>

        <SectionHeader title="Needs improvement" count={needs.length} color="text-rose-500" />
        <div className="flex flex-col gap-2">
          {needs.map((c) => (
            <ChapterChip key={c.name} c={c} />
          ))}
        </div>

        <SectionHeader title="Moderate" count={moderate.length} color="text-amber-600" />
        <div className="flex flex-col gap-2">
          {moderate.map((c) => (
            <ChapterChip key={c.name} c={c} />
          ))}
        </div>

        <SectionHeader title="Good" count={good.length} color="text-emerald-600" />
        <div className="flex flex-col gap-2">
          {good.map((c) => (
            <ChapterChip key={c.name} c={c} />
          ))}
        </div>
      </div>
    </div>
  )
}


