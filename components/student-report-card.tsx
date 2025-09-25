"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, ArrowLeft, ChevronDown, Play, Info, FileText, CheckCircle2 } from "lucide-react"
import { PerformanceChart } from "./performance-chart"
import { ProgressRing } from "./progress-ring"
import { Button } from "./ui/button"


interface SubjectData {
  score: number
  topperScore: number
  percentile: number
  attendance: {
    percent: number
    attended: number
    total: number
  }
  mcq: {
    percent: number
    attended: number
    total: number
    skipped: number
    correct: number
    incorrect: number
  }
  cq: {
    percent: number
    attended: number
    total: number
  }
  chapters: Array<{
    name: string
    attendance: {
      value: number
      unit: string
      total: number
      attended: number
      absent: number
    }
    mcq: {
      value: number
      unit: string
      correct: number
      total: number
      misses: string[]
      videos: string[]
    }
    mcqTopics: Array<{ name: string; score: string }>
    cqTopics: Array<{ name: string; score: string }>
  }>
}

const subjectsData: Record<string, SubjectData> = {
  Physics: {
    score: 82,
    topperScore: 90,
    percentile: 94,
    attendance: { percent: 85, attended: 20, total: 24 },
    mcq: { percent: 82, attended: 10, total: 50, skipped: 30, correct: 15, incorrect: 5 },
    cq: { percent: 88, attended: 18, total: 20 },
    chapters: [
      {
        name: "Newtonian Mechanics",
        attendance: { value: 95, unit: "%", total: 20, attended: 19, absent: 1 },
        mcq: {
          value: 75,
          unit: "%",
          correct: 30,
          total: 40,
          misses: ["Friction", "Circular Motion"],
          videos: ["লেকচার টপিক ২.২ - ঘর্ষণ", "লেকচার টপিক ২.৩ - বৃত্তীয় গতি"],
        },
        mcqTopics: [
          { name: "MCQ Topic 1", score: "9/10" },
          { name: "MCQ Topic 2", score: "8/10" },
        ],
        cqTopics: [
          { name: "Topic A", score: "7/10" },
          { name: "Topic B", score: "8/10" },
        ],
      },
      {
        name: "Vectors",
        attendance: { value: 100, unit: "%", total: 15, attended: 15, absent: 0 },
        mcq: {
          value: 98,
          unit: "%",
          correct: 49,
          total: 50,
          misses: ["Vector Triple Product"],
          videos: ["লেকচার টপিক ১.৫ - ভেক্টর ট্রিপল প্রোডাক্ট"],
        },
        mcqTopics: [
          { name: "MCQ Topic 1", score: "10/10" },
          { name: "MCQ Topic 2", score: "9/10" },
        ],
        cqTopics: [
          { name: "Topic A", score: "9/10" },
          { name: "Topic B", score: "10/10" },
        ],
      },
      {
        name: "Thermodynamics",
        attendance: { value: 88, unit: "%", total: 16, attended: 14, absent: 2 },
        mcq: { value: 75, unit: "%", correct: 30, total: 40, misses: ["Entropy"], videos: ["লেকচার টপিক ২.২ - এনট্রপি"] },
        mcqTopics: [
          { name: "MCQ Topic 1", score: "7/10" },
          { name: "MCQ Topic 2", score: "6/10" },
        ],
        cqTopics: [
          { name: "Topic A", score: "6/10" },
          { name: "Topic B", score: "7/10" },
        ],
      },
    ],
  },
  Chemistry: {
    score: 96,
    topperScore: 95,
    percentile: 98,
    attendance: { percent: 92, attended: 22, total: 24 },
    mcq: { percent: 88, attended: 18, total: 20, skipped: 2, correct: 16, incorrect: 2 },
    cq: { percent: 94, attended: 19, total: 20 },
    chapters: [],
  },
  Biology: {
    score: 95,
    topperScore: 95,
    percentile: 78,
    attendance: { percent: 78, attended: 18, total: 23 },
    mcq: { percent: 72, attended: 15, total: 20, skipped: 5, correct: 12, incorrect: 3 },
    cq: { percent: 80, attended: 16, total: 20 },
    chapters: [],
  },
}

// Demo leaderboard data
const leaderboardData: Array<{ name: string; percent: number; avatar?: string }> = [
  { name: "Larry Brown", percent: 98, avatar: "/student-avatar.png" },
  { name: "Rona Free", percent: 97, avatar: "/student-avatar.png" },
  { name: "Phil Gill", percent: 96, avatar: "/student-avatar.png" },
  { name: "Angona", percent: 95, avatar: "/student-avatar.png" },
  { name: "Greg Morrison", percent: 94, avatar: "/student-avatar.png" },
]

export default function StudentReportCard() {
  const [currentScreen, setCurrentScreen] = useState<"main" | "detail">("main")
  const [selectedSubject, setSelectedSubject] = useState<string>("")
  const [activeTab, setActiveTab] = useState<"overall" | "chapter-analysis">("overall")
  const [expandedChapter, setExpandedChapter] = useState<string>("")
  const contentRefs = useRef<Record<string, HTMLDivElement | null>>({})

  useEffect(() => {
    const updateHeights = () => {
      Object.entries(contentRefs.current).forEach(([name, el]) => {
        if (!el) return
        if (expandedChapter === name) {
          el.style.maxHeight = el.scrollHeight + "px"
        } else {
          el.style.maxHeight = "0px"
        }
      })
    }
    updateHeights()
    window.addEventListener("resize", updateHeights)
    return () => window.removeEventListener("resize", updateHeights)
  }, [expandedChapter, selectedSubject])

  const handleSubjectClick = (subject: string) => {
    setSelectedSubject(subject)
    setCurrentScreen("detail")
    setActiveTab("overall")
  }

  const handleBackClick = () => {
    setCurrentScreen("main")
    setSelectedSubject("")
  }

  const toggleChapter = (chapterName: string) => {
    setExpandedChapter(expandedChapter === chapterName ? "" : chapterName)
  }

  const getSubjectIcon = (subject: string) => {
    const colors = {
      Physics: "bg-indigo-100 text-indigo-600",
      Chemistry: "bg-pink-100 text-pink-600",
      Biology: "bg-green-100 text-green-600",
    }
    return colors[subject as keyof typeof colors] || "bg-gray-100 text-gray-600"
  }

  const MedalIcon = ({ rank }: { rank: number }) => {
    if (rank > 3) {
      return (
        <div className="w-12 h-12 flex items-center justify-center text-[16px] font-bold text-gray-600">{rank}</div>
      )
    }
    const srcMap: Record<number, string> = {
      1: "/first-rank-badge.webp",
      2: "/second-rank-badge.webp",
      3: "/3rd%20place.png",
    }
    return <img src={srcMap[rank]} alt={`Rank ${rank}`} className="w-12 h-12 object-contain shrink-0" />
  }

  return (
    <div className="w-full max-w-[390px] h-[844px] bg-white rounded-[40px] shadow-2xl overflow-hidden relative">
      {/* Main Report Screen */}
      <div
        className={`absolute inset-0 transition-transform duration-400 ease-in-out ${
          currentScreen === "detail" ? "-translate-x-full" : "translate-x-0"
        }`}
      >
        {/* Header */}
        <header className="bg-gradient-to-br from-purple-400 to-purple-700 text-white px-6 pt-5 pb-10">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-lg">shikho</span>
          </div>
          <div className="flex items-center">
            <img
              src="/student-avatar.png"
              alt="Student Avatar"
              className="w-11 h-11 rounded-full border-2 border-white mr-3"
            />
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-semibold">Angona</h1>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <ChevronLeft className="w-3.5 h-3.5 opacity-80 cursor-pointer" />
                  <span>Q1</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-80 cursor-pointer" />
                </div>
              </div>
              <p className="text-xs opacity-80 mt-0.5">HSC 2022</p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="bg-slate-50 rounded-t-[32px] -mt-6 relative z-10 px-6 pb-6 overflow-y-auto h-[calc(100%-140px)]">
          {/* Your Progress */}
          <section className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Progress</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-purple-300 to-purple-500 text-white rounded-2xl p-4 min-h-[140px] flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold uppercase opacity-80">Total Score</span>
                  <div className="flex items-center gap-2">
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <rect x="4" y="11" width="4" height="9" rx="2" fill="#7ba0ff" />
                      <rect x="10" y="5" width="4" height="15" rx="2" fill="#FFFFFF" />
                      <rect x="16" y="15" width="4" height="5" rx="2" fill="#ffc94a" />
                    </svg>
                    <Info className="w-4 h-4 bg-black/15 rounded-full p-0.5" />
                  </div>
                </div>
                <div className="text-4xl font-bold flex-1 flex items-center">90%</div>
              </div>
              <div className="bg-gradient-to-br from-blue-300 to-blue-500 text-white rounded-2xl p-4 min-h-[140px] flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold uppercase opacity-80">Class Rank</span>
                  <div className="flex items-center gap-2">
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <rect x="4" y="11" width="4" height="9" rx="2" fill="#FFFFFF" opacity="0.8" />
                      <rect x="10" y="5" width="4" height="15" rx="2" fill="#ff7b7b" />
                      <rect x="16" y="15" width="4" height="5" rx="2" fill="#FFFFFF" opacity="0.8" />
                    </svg>
                    <Info className="w-4 h-4 bg-black/15 rounded-full p-0.5" />
                  </div>
                </div>
                <div className="text-4xl font-bold flex-1 flex items-center">
                  10<span className="text-lg font-medium opacity-80 ml-0.5">/500</span>
                </div>
              </div>
            </div>
          </section>

          {/* Subject-wise Performance */}
          <section className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Subject-wise Performance</h2>
            <div className="space-y-0">
              <div className="grid grid-cols-3 gap-4 text-xs font-medium text-gray-500 pb-3">
                <span className="text-left">Subject</span>
                <span className="text-center">Your Score</span>
                <span className="text-center">Topper's Score</span>
              </div>
              {Object.entries(subjectsData).map(([subject, data]) => (
                <div
                  key={subject}
                  className="grid grid-cols-3 gap-4 py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 -mx-2 px-2 rounded"
                  onClick={() => handleSubjectClick(subject)}
                >
                  <div className="flex items-center">
                    <div className="relative mr-3">
                      {data.score === data.topperScore && (
                        <span className="absolute -top-3 -left-1 px-2 py-0.5 rounded bg-[#ffc94a] text-white text-[10px] font-semibold shadow-sm">Topper</span>
                      )}
                      <div
                        className={`w-8 h-8 rounded-lg ${getSubjectIcon(subject)} flex items-center justify-center text-sm font-bold`}
                      >
                        {subject[0]}
                      </div>
                    </div>
                    <span className="font-semibold text-gray-800">{subject}</span>
                  </div>
                  <span className="text-center font-semibold text-[#48319d]">{data.score}%</span>
                  <span className="text-center font-semibold text-[#ffc94a]">{data.topperScore}%</span>
                </div>
              ))}
            </div>
          </section>

          {/* Learning Stats */}
          <section className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Learning Stats</h2>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white border border-gray-200 rounded-2xl p-3 text-center">
                <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <svg viewBox="0 0 64 64" className="w-full h-full">
                    <path
                      d="M49,34.86c0-1,0-1.92.06-2.86H32.17a3.83,3.83,0,0,0-3.83,3.83v8.34a3.84,3.84,0,0,0,3.83,3.83H45.17L52,50V38.69A3.83,3.83,0,0,0,49,34.86Z"
                      fill="#d9c8fb"
                    />
                    <path
                      d="M43.14,14a4.8,4.8,0,0,0-4.79,4.79V29.7a4.8,4.8,0,0,0,4.79,4.8H52.4L60,40V24.33a4.8,4.8,0,0,0-4.79-4.8H50.42v-0.75a4.8,4.8,0,0,0-4.79-4.79Z"
                      fill="#A076F9"
                    />
                  </svg>
                </div>
                <div className="text-xs text-gray-500 mb-1 leading-tight"><div>Live Class</div><div>Attendance</div></div>
                <div className="text-xl font-bold text-purple-500">85%</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-3 text-center">
                <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <svg viewBox="0 0 64 64" className="w-full h-full">
                    <circle cx="32" cy="32" r="24" fill="#FFC94A" />
                    <path
                      d="M32.5,14V34.25a1,1,0,0,1-1.4.9L22,30"
                      fill="none"
                      stroke="#fff"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="4"
                    />
                  </svg>
                </div>
                <div className="text-xs text-gray-500 mb-1 leading-tight"><div>Live MCQ</div><div>Score %</div></div>
                <div className="text-xl font-bold text-yellow-500">72%</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-3 text-center">
                <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <svg viewBox="0 0 64 64" className="w-full h-full">
                    <circle cx="32" cy="32" r="24" fill="#2ECC71" />
                    <path
                      d="M22,32l8,8L42,26"
                      fill="none"
                      stroke="#fff"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="5"
                    />
                  </svg>
                </div>
                <div className="text-xs text-gray-500 mb-1 leading-tight"><div>Live CQ</div><div>Score %</div></div>
                <div className="text-xl font-bold text-green-500">68%</div>
              </div>
            </div>
          </section>

          {/* Performance Trend */}
          <section className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Performance Trend</h2>
            <PerformanceChart />
          </section>

          {/* Leaderboard */}
          <section className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Leaderboard</h2>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm divide-y divide-gray-100">
              {leaderboardData.map((item, index) => (
                <div
                  key={item.name}
                  className={`flex items-center justify-between p-3 ${
                    index === 0
                      ? "bg-gradient-to-r from-purple-50/80 to-purple-100/60"
                      : index === 1
                      ? "bg-gradient-to-r from-indigo-50/80 to-indigo-100/60"
                      : index === 2
                      ? "bg-gradient-to-r from-pink-50/80 to-pink-100/60"
                      : "bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <MedalIcon rank={index + 1} />
                    <img
                      src={item.avatar || "/student-avatar.png"}
                      alt={item.name}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    />
                    <span className="font-semibold text-gray-800">{item.name}</span>
                  </div>
                  <span className="text-[#48319d] font-bold">{item.percent}%</span>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* Subject Detail Screen */}
      <div
        className={`absolute inset-0 transition-transform duration-400 ease-in-out ${
          currentScreen === "detail" ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 h-full overflow-y-auto bg-slate-50">
          <ArrowLeft className="w-6 h-6 text-gray-500 cursor-pointer mb-2" onClick={handleBackClick} />

          {selectedSubject && (
            <>
              {/* Header Card */}
              <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between shadow-sm mb-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{selectedSubject}</h2>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-extrabold text-gray-900">{subjectsData[selectedSubject].score}%</div>
                  <div className="text-xs text-gray-500">Avg. Score</div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <nav className="flex border-b border-gray-200 mb-6">
                <button
                  className={`flex-1 text-center pb-3 text-sm font-medium relative ${
                    activeTab === "overall" ? "text-purple-700 font-semibold" : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("overall")}
                >
                  Overall
                  {activeTab === "overall" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-700 rounded-t"></div>
                  )}
                </button>
                <button
                  className={`flex-1 text-center pb-3 text-sm font-medium relative ${
                    activeTab === "chapter-analysis" ? "text-purple-700 font-semibold" : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("chapter-analysis")}
                >
                  Chapter Analysis
                  {activeTab === "chapter-analysis" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-700 rounded-t"></div>
                  )}
                </button>
              </nav>

              {/* Tab Content */}
              {activeTab === "overall" && (
                <div className="space-y-5">
                  {/* Live Class Attendance */}
                  <div className="bg-white rounded-2xl p-5 shadow-sm">
                    <h3 className="text-base font-semibold text-gray-600 mb-4 text-center">Live Class Attendance</h3>
                    <div className="flex flex-col items-center gap-4">
                      <ProgressRing
                        percentage={subjectsData[selectedSubject].attendance.percent}
                        size={140}
                        color="#835FF1"
                      >
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">
                            {subjectsData[selectedSubject].attendance.percent}%
                          </div>
                        </div>
                      </ProgressRing>

                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full border border-blue-200 bg-blue-50 text-xs text-blue-700 inline-flex items-center gap-1.5">
                          🏫 Total Classes: {subjectsData[selectedSubject].attendance.total}
                        </span>
                        <span className="px-3 py-1 rounded-full border border-emerald-200 bg-emerald-50 text-xs text-emerald-700 inline-flex items-center gap-1.5">
                          ✅ Present: {subjectsData[selectedSubject].attendance.attended}
                        </span>
                      </div>

                      <Button
                        variant="outline"
                        className="w-full mt-2 border-[#48319d] text-[#48319d] hover:bg-[#48319d]/5 bg-transparent"
                      >
                        View Missed Classes
                      </Button>
                    </div>
                  </div>

                  {/* Live MCQ Exam */}
                  <div className="bg-white rounded-2xl p-5 shadow-sm">
                    <h3 className="text-base font-semibold text-gray-600 mb-4 text-center">Live MCQ Exam</h3>
                    <div className="flex flex-col items-center gap-3">
                      <div className="text-3xl font-bold text-gray-900">{subjectsData[selectedSubject].mcq.percent}%</div>
                      <div className="text-xs text-gray-500">Average Score</div>
                      <div className="w-full mt-3">
                        {(() => {
                          const correct = subjectsData[selectedSubject].mcq.correct
                          const incorrect = subjectsData[selectedSubject].mcq.incorrect
                          const answered = correct + incorrect
                          const correctPct = answered > 0 ? (correct / answered) * 100 : 0
                          const incorrectPct = answered > 0 ? (incorrect / answered) * 100 : 0
                          const greenCenter = correctPct / 2
                          const redCenter = correctPct + incorrectPct / 2
                          return (
                            <div>
                              <div className="relative w-full">
                                <div
                                  className="absolute -top-5 text-[11px] font-semibold text-green-700"
                                  style={{ left: `${greenCenter}%`, transform: 'translateX(-50%)' }}
                                >
                                  {correct}
                                </div>
                                <div
                                  className="absolute -top-5 text-[11px] font-semibold text-red-700"
                                  style={{ left: `${redCenter}%`, transform: 'translateX(-50%)' }}
                                >
                                  {incorrect}
                                </div>
                                <div className="h-3 w-full bg-[#4a6bff]/20 rounded-full overflow-hidden flex">
                                  <div className="h-full" style={{ width: `${correctPct}%`, background: "#80d28b" }} />
                                  <div className="h-full" style={{ width: `${incorrectPct}%`, background: "#ee8b8b" }} />
                                </div>
                              </div>
                              <div className="mt-3 text-xs text-gray-600">
                                <div className="mb-1">Total Questions: {subjectsData[selectedSubject].mcq.total}</div>
                                <div className="flex items-center gap-4">
                                  <span className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-green-500" /> Correct Answers
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-red-500" /> Incorrect Answers
                                  </span>
                                </div>
                              </div>
                            </div>
                          )
                        })()}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full mt-4 border-[#48319d] text-[#48319d] hover:bg-[#48319d]/5 bg-transparent"
                    >
                      Review Exams
                    </Button>
                  </div>

                  {/* Live CQ Exam */}
                  <div className="bg-white rounded-2xl p-5 shadow-sm">
                    <h3 className="text-base font-semibold text-gray-600 mb-4 text-center">Live CQ Exam</h3>
                    <div className="flex flex-col items-center gap-3">
                      <div className="text-2xl font-bold text-gray-900">
                            {subjectsData[selectedSubject].cq.percent}%
                      </div>
                      <div className="text-xs text-gray-500">Average Score</div>
                      {(() => {
                        const attended = subjectsData[selectedSubject].cq.attended
                        const total = subjectsData[selectedSubject].cq.total
                        const value = total > 0 ? (attended / total) * 100 : 0
                        return (
                          <div className="h-2 w-full bg-[#4a6bff]/20 rounded-full overflow-hidden">
                            <div className="h-full bg-[#4a6bff]" style={{ width: `${value}%` }} />
                          </div>
                        )
                      })()}
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full border border-blue-200 bg-blue-50 text-xs text-blue-700 inline-flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5" /> Total Exams: {subjectsData[selectedSubject].cq.total}
                        </span>
                        <span className="px-3 py-1 rounded-full border border-emerald-200 bg-emerald-50 text-xs text-emerald-700 inline-flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Attended: {subjectsData[selectedSubject].cq.attended}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full mt-1 border-[#48319d] text-[#48319d] hover:bg-[#48319d]/5 bg-transparent"
                      >
                        Review Exams
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "chapter-analysis" && (
                <div>
                  {/* Chapter List */}
                  <div className="ca-list">
                    {subjectsData[selectedSubject].chapters.map((chapter) => {
                      const isOpen = expandedChapter === chapter.name
                      return (
                        <div key={chapter.name} className={`ca-card ${isOpen ? "expanded" : ""}`}>
                          <div className="ca-header" onClick={() => toggleChapter(chapter.name)}>
                            <h3 className="ca-title">{chapter.name}</h3>
                            <ChevronDown className="w-5 h-5 ca-arrow" />
                          </div>
                          <div
                            ref={(el) => {
                              contentRefs.current[chapter.name] = el
                            }}
                            className="ca-content"
                            style={{ maxHeight: isOpen ? undefined : 0 }}
                          >
                            {/* Section: Class Statistics */}
                            <div className="ca-section">
                              <div className="ca-section-title">Class Statistics</div>
                              <div className="ca-stats">
                                <div className="ca-stat-box ca-stat--total">
                                  <div className="label">Total Class</div>
                                  <div className="value">{chapter.attendance.total}</div>
                        </div>
                                <div className="ca-stat-box ca-stat--attended">
                                  <div className="label">Attended</div>
                                  <div className="value">{chapter.attendance.attended}</div>
                                </div>
                                <div className="ca-stat-box ca-stat--absent">
                                  <div className="label">Absent</div>
                                  <div className="value">{chapter.attendance.absent}</div>
                                </div>
                              </div>
                            </div>

                            {/* Section: Live MCQ Score */}
                            <div className="ca-section">
                              <div className="ca-section-title">Live MCQ Score</div>
                              <div className="ca-topics">
                                {chapter.mcqTopics.map((t) => (
                                  <div key={t.name} className="ca-topic-row">
                                    <span className="ca-topic-name">{t.name}</span>
                                    <span className="ca-topic-score">{t.score}</span>
                                  </div>
                                ))}
                                    </div>
                              <button className="ca-btn-outline">Review</button>
                                    </div>

                            {/* Section: Live CQ Score */}
                            <div className="ca-section">
                              <div className="ca-section-title">Live CQ Score</div>
                              <div className="ca-topics">
                                {chapter.cqTopics.map((t) => (
                                  <div key={t.name} className="ca-topic-row">
                                    <span className="ca-topic-name">{t.name}</span>
                                    <span className="ca-topic-score">{t.score}</span>
                                  </div>
                                ))}
                              </div>
                              <button className="ca-btn-outline">Review</button>
                                </div>

                            {/* Section: Key Weak Areas */}
                            <div className="ca-section">
                              <div className="ca-section-title">Key Weak Areas</div>
                              <div className="ca-pills">
                                    {chapter.mcq.misses.map((miss) => (
                                  <span key={miss} className="ca-pill">{miss}</span>
                                    ))}
                                  </div>
                                </div>

                            {/* Section: Recommended Videos */}
                            <div className="ca-section">
                              <div className="ca-section-title">Recommended Videos</div>
                              <div className="flex flex-col gap-3">
                                {chapter.mcq.videos.map((video) => (
                                  <div key={video} className="ca-video-card">
                                    <span className="text-sm font-medium">{video}</span>
                                    <span className="ca-play"><Play className="w-3.5 h-3.5" /></span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                          </div>
                      </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
