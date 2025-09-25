"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, ArrowLeft, ChevronDown, Info, FileText, CheckCircle2 } from "lucide-react"
import { PerformanceChart } from "./performance-chart"
import { ProgressRing } from "./progress-ring"
import { Button } from "./ui/button"
import SubjectDetail, { SubjectData } from "./subject-detail"
import ChapterDetail from "./chapter-detail"

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
        score: 65,
        hint: "Weak in friction concepts",
        classStats: { totalClasses: 20, attended: 19, absent: 1 },
        mcqTopics: [
          { name: "Kinematics Basics", percent: 72 },
          { name: "Friction", percent: 55 },
          { name: "Circular Motion", percent: 60 },
          { name: "Work & Energy", percent: 85 },
        ],
        cqTopics: [
          { name: "Projectile Motion", score: "7/10" },
          { name: "Newton's Laws", score: "6/10" },
          { name: "Momentum", score: "8/10" },
          { name: "Work-Energy", score: "5/10" },
        ],
        weakAreas: ["Friction", "Circular Motion"],
        recommendedVideos: ["লেকচার টপিক ২.২ - ঘর্ষণ", "লেকচার টপিক ২.৩ - বৃত্তীয় গতি"],
      },
      {
        name: "Vectors",
        score: 92,
        hint: "All concepts cleared",
        classStats: { totalClasses: 15, attended: 15, absent: 0 },
        mcqTopics: [
          { name: "Vector Addition", percent: 95 },
          { name: "Dot Product", percent: 92 },
          { name: "Cross Product", percent: 90 },
          { name: "Applications", percent: 88 },
        ],
        cqTopics: [
          { name: "Vector Proofs", score: "9/10" },
          { name: "Geometry", score: "10/10" },
          { name: "Physics Problems", score: "9/10" },
          { name: "Mixed", score: "8/10" },
        ],
        weakAreas: ["Vector Triple Product"],
        recommendedVideos: ["লেকচার টপিক ১.৫ - ভেক্টর ট্রিপল প্রোডাক্ট"],
      },
      {
        name: "Thermodynamics",
        score: 78,
        hint: "Review the topic of Entropy",
        classStats: { totalClasses: 16, attended: 14, absent: 2 },
        mcqTopics: [
          { name: "Temperature & Heat", percent: 82 },
          { name: "Laws of Thermodynamics", percent: 74 },
          { name: "Entropy", percent: 62 },
          { name: "Engines", percent: 80 },
        ],
        cqTopics: [
          { name: "Problem Set A", score: "6/10" },
          { name: "Problem Set B", score: "7/10" },
          { name: "Theory", score: "8/10" },
          { name: "Mixed", score: "7/10" },
        ],
        weakAreas: ["Entropy"],
        recommendedVideos: ["লেকচার টপিক ২.২ - এনট্রপি"],
      },
      {
        name: "Electromagnetism",
        score: 58,
        hint: "Watch 2 recommended videos",
        classStats: { totalClasses: 18, attended: 13, absent: 5 },
        mcqTopics: [
          { name: "Electrostatics", percent: 65 },
          { name: "Magnetism", percent: 60 },
          { name: "Induction", percent: 55 },
          { name: "AC Circuits", percent: 52 },
        ],
        cqTopics: [
          { name: "Gauss's Law", score: "6/10" },
          { name: "Ampere's Law", score: "5/10" },
          { name: "Faraday", score: "6/10" },
          { name: "RLC", score: "5/10" },
        ],
        weakAreas: ["Induction", "AC Circuits"],
        recommendedVideos: ["Induction Basics", "RLC Visual Guide"],
      },
      {
        name: "Modern Physics",
        score: 88,
        hint: "Good grasp on fundamentals",
        classStats: { totalClasses: 12, attended: 11, absent: 1 },
        mcqTopics: [
          { name: "Photoelectric", percent: 90 },
          { name: "Relativity", percent: 86 },
          { name: "Quantum", percent: 84 },
          { name: "Nuclear", percent: 92 },
        ],
        cqTopics: [
          { name: "Atomic Models", score: "8/10" },
          { name: "Relativity", score: "9/10" },
          { name: "Quantum", score: "8/10" },
          { name: "Nuclear", score: "9/10" },
        ],
        weakAreas: [],
        recommendedVideos: ["Relativity in 10 mins"],
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
  "Higher Math": {
    score: 88,
    topperScore: 94,
    percentile: 90,
    attendance: { percent: 82, attended: 20, total: 24 },
    mcq: { percent: 74, attended: 18, total: 20, skipped: 1, correct: 15, incorrect: 3 },
    cq: { percent: 86, attended: 17, total: 20 },
    chapters: [],
  },
  English: {
    score: 91,
    topperScore: 96,
    percentile: 88,
    attendance: { percent: 90, attended: 22, total: 24 },
    mcq: { percent: 78, attended: 16, total: 20, skipped: 2, correct: 15, incorrect: 3 },
    cq: { percent: 89, attended: 18, total: 20 },
    chapters: [],
  },
  Bangla: {
    score: 84,
    topperScore: 92,
    percentile: 81,
    attendance: { percent: 88, attended: 21, total: 24 },
    mcq: { percent: 69, attended: 14, total: 20, skipped: 2, correct: 12, incorrect: 6 },
    cq: { percent: 83, attended: 16, total: 20 },
    chapters: [],
  },
  ICT: {
    score: 93,
    topperScore: 97,
    percentile: 92,
    attendance: { percent: 91, attended: 21, total: 23 },
    mcq: { percent: 85, attended: 17, total: 20, skipped: 1, correct: 16, incorrect: 3 },
    cq: { percent: 87, attended: 18, total: 20 },
    chapters: [],
  },
  History: {
    score: 79,
    topperScore: 88,
    percentile: 73,
    attendance: { percent: 80, attended: 19, total: 24 },
    mcq: { percent: 65, attended: 13, total: 20, skipped: 4, correct: 10, incorrect: 6 },
    cq: { percent: 76, attended: 15, total: 20 },
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
  const [currentScreen, setCurrentScreen] = useState<"main" | "subject" | "chapter">("main")
  const [selectedSubject, setSelectedSubject] = useState<string>("")
  const [selectedChapter, setSelectedChapter] = useState<string>("")
  const [showAllSubjects, setShowAllSubjects] = useState<boolean>(false)
  const extraSubjectsRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = extraSubjectsRef.current
    if (!el) return
    if (showAllSubjects) {
      el.style.maxHeight = el.scrollHeight + "px"
    } else {
      el.style.maxHeight = "0px"
    }
  }, [showAllSubjects])

  const handleSubjectClick = (subject: string) => {
    setSelectedSubject(subject)
    setCurrentScreen("subject")
  }

  const handleBackToMain = () => {
    setCurrentScreen("main")
    setSelectedSubject("")
    setSelectedChapter("")
  }

  const handleChapterClick = (chapterName: string) => {
    setSelectedChapter(chapterName)
    setCurrentScreen("chapter")
  }

  const getSubjectIcon = (subject: string) => {
    const colors = {
      Physics: "bg-indigo-100 text-indigo-600",
      Chemistry: "bg-pink-100 text-pink-600",
      Biology: "bg-green-100 text-green-600",
      "Higher Math": "bg-blue-100 text-blue-600",
      English: "bg-yellow-100 text-yellow-600",
      Bangla: "bg-purple-100 text-purple-600",
      ICT: "bg-teal-100 text-teal-600",
      History: "bg-orange-100 text-orange-600",
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
          currentScreen === "main" ? "translate-x-0" : "-translate-x-full"
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

          {/* Subject-wise Performance - moved below Learning Stats via new section below */}

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

          {/* Subject-wise Performance (after Learning Stats) */}
          <section className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Subject-wise Performance</h2>
            <div className="space-y-0">
              <div className="grid grid-cols-[1.7fr_1fr_1fr] gap-4 text-xs font-medium text-gray-500 pb-3">
                <span className="text-left">Subject</span>
                <span className="text-center whitespace-nowrap">Your Score</span>
                <span className="text-center whitespace-nowrap">Topper's Score</span>
              </div>
              {(() => {
                const entries = Object.entries(subjectsData)
                const first = entries.slice(0, 4)
                const rest = entries.slice(4)
                return (
                  <div>
                    {first.map(([subject, data]) => (
                      <div
                        key={subject}
                        className="relative grid grid-cols-[1.7fr_1fr_1fr] gap-4 py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 -mx-2 px-2 pr-7 rounded"
                        onClick={() => handleSubjectClick(subject)}
                      >
                        <div className="flex items-center min-w-0">
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
                          <span className="font-semibold text-gray-800 text-[13px] whitespace-nowrap">{subject}</span>
                        </div>
                        <span className="text-center font-semibold text-[#48319d]">{data.score}%</span>
                        <span className="text-center font-semibold text-[#ffc94a]">{data.topperScore}%</span>
                        <svg className="w-4 h-4 text-gray-300 absolute right-2 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                      </div>
                    ))}

                    {rest.length > 0 && (
                      <div
                        ref={extraSubjectsRef}
                        className="overflow-hidden transition-[max-height] duration-300"
                        style={{ maxHeight: 0 }}
                      >
                        {rest.map(([subject, data]) => (
                          <div
                            key={subject}
                            className="relative grid grid-cols-[1.7fr_1fr_1fr] gap-4 py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 -mx-2 px-2 pr-7 rounded"
                            onClick={() => handleSubjectClick(subject)}
                          >
                            <div className="flex items-center min-w-0">
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
                              <span className="font-semibold text-gray-800 text-[13px] whitespace-nowrap">{subject}</span>
                            </div>
                            <span className="text-center font-semibold text-[#48319d]">{data.score}%</span>
                            <span className="text-center font-semibold text-[#ffc94a]">{data.topperScore}%</span>
                            <svg className="w-4 h-4 text-gray-300 absolute right-2 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                          </div>
                        ))}
                      </div>
                    )}

                    {rest.length > 0 && (
                      <button
                        className="w-full flex items-center justify-center gap-1.5 text-sm font-semibold text-[#48319d] mt-3"
                        onClick={() => setShowAllSubjects(!showAllSubjects)}
                      >
                        {showAllSubjects ? "See Less" : "See More"}
                        <ChevronDown className={`w-4 h-4 transition-transform ${showAllSubjects ? "rotate-180" : "rotate-0"}`} />
                      </button>
                    )}
                  </div>
                )
              })()}
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
            <div className="rounded-2xl border border-purple-100 bg-purple-50 p-2 shadow-sm space-y-2">
              {leaderboardData.map((item, index) => (
                <div
                  key={item.name}
                  className={`flex items-center justify-between p-3 rounded-xl ${
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
          currentScreen === "subject" ? "translate-x-0" : currentScreen === "chapter" ? "-translate-x-full" : "translate-x-full"
        }`}
      >
        <div className="p-4 h-full overflow-y-auto bg-slate-50">
          <div className="flex items-center gap-2 mb-2">
            <ArrowLeft className="w-6 h-6 text-gray-500 cursor-pointer" onClick={handleBackToMain} />
            {selectedSubject && <span className="text-sm font-semibold text-gray-700">{selectedSubject}</span>}
          </div>

          {selectedSubject && (
            <SubjectDetail
              subjectName={selectedSubject}
              subject={subjectsData[selectedSubject]}
              onChapterClick={handleChapterClick}
            />
          )}
                    </div>
                  </div>

      {/* Chapter Detail Screen */}
      <div
        className={`absolute inset-0 transition-transform duration-400 ease-in-out ${
          currentScreen === "chapter" ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 h-full overflow-y-auto bg-slate-50">
          <div className="flex items-center gap-2 mb-2">
            <ArrowLeft
              className="w-6 h-6 text-gray-500 cursor-pointer"
              onClick={() => setCurrentScreen("subject")}
            />
            {selectedSubject && <span className="text-sm font-semibold text-gray-700">{selectedSubject}</span>}
          </div>
          {selectedSubject && selectedChapter && (
            <ChapterDetail
              subjectName={selectedSubject}
              subject={subjectsData[selectedSubject]}
              chapter={subjectsData[selectedSubject].chapters.find((c) => c.name === selectedChapter) as any}
            />
          )}
        </div>
      </div>
    </div>
  )
}
