"use client"

import { useEffect, useState } from "react"
import { Volume2, Bookmark, RotateCcw, Check } from "lucide-react"
import type { LanguagePair, Recognition } from "@/lib/vocab"

type CaptureModalProps = {
  data: { image: string; recognition: Recognition } | null
  languagePair: LanguagePair
  onClose: () => void
  onRetake: () => void
}

export function CaptureModal({ data, languagePair, onClose, onRetake }: CaptureModalProps) {
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (data) setSaved(false)
  }, [data])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    if (data) document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [data, onClose])

  function speak() {
    if (!data || typeof window === "undefined" || !window.speechSynthesis) return
    const utter = new SpeechSynthesisUtterance(data.recognition.translation)
    utter.lang = languagePair.speechLocale
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utter)
  }

  if (!data) return null
  const { image, recognition } = data

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div onClick={onClose} className="absolute inset-0 animate-in fade-in bg-black/70 backdrop-blur-sm duration-200" />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Kết quả nhận diện"
        className="relative mx-auto w-full max-w-md animate-in slide-in-from-bottom-6 fade-in rounded-t-3xl border-t border-neutral-800 bg-neutral-900 p-5 pb-8 shadow-2xl duration-300 ease-out sm:rounded-3xl sm:border"
      >
        <div className="mx-auto mb-5 h-1.5 w-10 rounded-full bg-neutral-700 sm:hidden" />

        <div className="flex gap-4">
          {/* thumbnail */}
          <img
            src={image || "/placeholder.svg"}
            alt="Ảnh vừa chụp"
            crossOrigin="anonymous"
            className="size-24 shrink-0 rounded-2xl object-cover ring-1 ring-white/10"
          />

          <div className="flex min-w-0 flex-1 flex-col justify-center">
            <div className="flex items-baseline gap-2">
              <h2 className="truncate text-2xl font-semibold text-neutral-50">{recognition.source}</h2>
              <span className="shrink-0 text-sm italic text-neutral-400">({recognition.partOfSpeech})</span>
            </div>

            <div className="mt-1 flex items-center gap-2">
              <span className="text-lg font-medium text-amber-400">{recognition.translation}</span>
              <button
                type="button"
                onClick={speak}
                aria-label="Nghe phát âm"
                className="flex size-8 items-center justify-center rounded-full bg-amber-500/15 text-amber-400 transition-colors hover:bg-amber-500/25 active:scale-95"
              >
                <Volume2 className="size-4" />
              </button>
            </div>

            <p className="mt-0.5 font-mono text-sm text-neutral-400">{recognition.ipa}</p>
          </div>
        </div>

        {/* actions */}
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={() => setSaved(true)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-semibold transition-colors active:scale-[0.98] ${
              saved
                ? "bg-emerald-500/15 text-emerald-400"
                : "bg-amber-400 text-neutral-900 hover:bg-amber-300"
            }`}
          >
            {saved ? <Check className="size-5" /> : <Bookmark className="size-5" />}
            {saved ? "Đã lưu" : "Lưu vào bộ sưu tập"}
          </button>

          <button
            type="button"
            onClick={onRetake}
            className="flex items-center justify-center gap-2 rounded-2xl bg-neutral-800 px-5 py-3.5 text-sm font-semibold text-neutral-100 transition-colors hover:bg-neutral-700 active:scale-[0.98]"
          >
            <RotateCcw className="size-5" />
            Chụp lại
          </button>
        </div>
      </div>
    </div>
  )
}
