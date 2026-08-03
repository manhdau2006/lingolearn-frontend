"use client"

import { useEffect, useState } from "react"
import { Volume2, Bookmark, RotateCcw, Check, FolderPlus } from "lucide-react"
import type { LanguagePair, Recognition } from "@/lib/vocab"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type CaptureModalProps = {
  data: { image: string; recognition: Recognition } | null
  languagePair: LanguagePair
  onClose: () => void
  onRetake: () => void
}

const MOCK_FOLDERS = [
  { id: "untitled1", name: "#untitled1" },
  { id: "untitled2", name: "#untitled2" },
  { id: "phong-khach", name: "#phòng_khách" },
  { id: "ngoai-troi", name: "#ngoài_trời" },
  { id: "cong-so", name: "#công_sở" },
  { id: "du-lich", name: "#du_lịch" },
]

export function CaptureModal({ data, languagePair, onClose, onRetake }: CaptureModalProps) {
  const [saved, setSaved] = useState(false)
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)

  useEffect(() => {
    if (data) {
      setSaved(false)
      setSelectedFolder(null)
    }
  }, [data])

  function speak() {
    if (!data || typeof window === "undefined" || !window.speechSynthesis) return
    const utter = new SpeechSynthesisUtterance(data.recognition.translation)
    utter.lang = languagePair.speechLocale
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utter)
  }

  const handleSelectFolder = (val: unknown) => {
    if (typeof val === "string") {
      setSelectedFolder(val)
    }
  }

  const recognition = data?.recognition
  const image = data?.image

  return (
    <Dialog open={!!data} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="max-w-md border-neutral-800 bg-neutral-900 text-neutral-50 p-5 rounded-3xl sm:max-w-md">
        {data && recognition && (
          <>
            <DialogHeader className="sr-only">
              <DialogTitle>Kết quả nhận diện từ vựng</DialogTitle>
              <DialogDescription>Chi tiết từ vựng và phiên âm</DialogDescription>
            </DialogHeader>

            <div className="flex gap-4 pt-2">
              {/* thumbnail */}
              <img
                src={image || "/chair-preview.png"}
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

            {/* Folder selection dropdown */}
            <div className="mt-5 flex flex-col gap-1.5">
              <label className="text-xs font-medium text-neutral-400">Chọn thư mục để lưu...</label>
              <Select value={selectedFolder || undefined} onValueChange={handleSelectFolder}>
                <SelectTrigger className="w-full justify-between rounded-2xl border border-neutral-800 bg-neutral-800/80 px-4 py-3 text-sm text-neutral-200">
                  <SelectValue placeholder="Chọn thư mục để lưu..." />
                </SelectTrigger>
                <SelectContent className="w-full border-neutral-800 bg-neutral-900 text-neutral-100">
                  {MOCK_FOLDERS.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id}>
                      {folder.name}
                    </SelectItem>
                  ))}
                  <div className="my-1 border-t border-neutral-800" />
                  <SelectItem value="create_new" className="font-semibold text-amber-400 hover:text-amber-300">
                    <span className="flex items-center gap-1.5">
                      <FolderPlus className="size-4" />
                      + Tạo thư mục mới
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* actions */}
            <div className="mt-4 flex gap-3">
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
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}


