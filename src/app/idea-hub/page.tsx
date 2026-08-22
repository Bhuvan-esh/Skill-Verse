"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { OrbitalClock } from "@/components/ui/orbital-clock"

export default function IdeaHubLaunchPage() {
  const [notified, setNotified] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleNotify = async () => {
    setLoading(true)
    // TODO: replace with the real write — e.g.
    // await addDoc(collection(db, "interestedUsers"), { uid: user.uid, createdAt: serverTimestamp() })
    await new Promise((r) => setTimeout(r, 700))
    setLoading(false)
    setNotified(true)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#08070d] text-slate-100 px-6 w-full relative overflow-hidden">
      {/* Background Aura Radial Glow */}
      <div 
        className="fixed inset-0 pointer-events-none -z-10"
        style={{ background: 'radial-gradient(circle at 50% 50%, rgba(167, 139, 250, 0.15) 0%, rgba(8, 7, 13, 0.98) 70%)' }}
      />

      {/* Button to comeback to Horizon */}
      <Link
        href="/horizon"
        className="fixed top-6 left-6 z-50 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-300 hover:text-white border border-white/10 flex items-center space-x-2 transition-all cursor-pointer shadow-lg backdrop-blur-md group"
      >
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-purple-400" />
        <span>← Back to Horizon</span>
      </Link>

      <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground font-mono">
        Club Idea Hub
      </p>
      <h1 className="font-serif text-4xl md:text-5xl text-center">
        Launching <span className="italic text-[color:var(--orb-primary,#a78bfa)]">soon.</span>
      </h1>
      <p className="text-sm text-muted-foreground text-center max-w-md mb-10">
        Where every student pitch, prototype, and half-formed 2am idea gets a real home.
      </p>

      <OrbitalClock />

      <p className="text-xs text-muted-foreground font-mono tracking-wide mt-16 mb-6">
        [ local time ]
      </p>

      <div className="w-full max-w-[420px] flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl px-6 py-5">
        <div>
          <p className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground mb-1.5">
            Status
          </p>
          <p className="font-serif text-lg text-foreground">Building final modules</p>
        </div>

        <button
          onClick={handleNotify}
          disabled={loading || notified}
          className={`shrink-0 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all
            ${notified
              ? "bg-emerald-400/90 text-black cursor-default"
              : "bg-[color:var(--orb-primary,#a78bfa)] text-black hover:brightness-110 hover:-translate-y-0.5 cursor-pointer"
            }
            disabled:opacity-70`}
        >
          {loading ? "Adding…" : notified ? "You're on the list" : "Notify me"}
        </button>
      </div>
    </main>
  )
}
