"use client"

import { useEffect, useRef, useState } from "react"
import { Volume2, Bookmark, RotateCcw, Check, FolderPlus, ChevronDown, RefreshCw } from "lucide-react"
import type { LanguagePair, Recognition } from "@/lib/vocab"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

type CaptureModalProps = {
  data: { image: string; recognition: Recognition } | null
  languagePair: LanguagePair
  onClose: () => void
  onRetake: () => void
}

type FolderItem = {
  id: string
  name: string
}

const INITIAL_FOLDERS: FolderItem[] = [
  { id: "unsaved", name: "#unsaved (Mặc định)" },
  { id: "untitled1", name: "#untitled1" },
  { id: "untitled2", name: "#untitled2" },
  { id: "phong-khach", name: "#phòng_khách" },
  { id: "ngoai-troi", name: "#ngoài_trời" },
  { id: "cong-so", name: "#công_sở" },
  { id: "du-lich", name: "#du_lịch" },
]

function areFoldersEqual(a: string[], b: string[]) {
  if (a.length !== b.length) return false
  const sortedA = [...a].sort()
  const sortedB = [...b].sort()
  return sortedA.every((val, index) => val === sortedB[index])
}

export function CaptureModal({ data, languagePair, onClose, onRetake }: CaptureModalProps) {
  const [folders, setFolders] = useState<FolderItem[]>(INITIAL_FOLDERS)
  const [selectedFolderIds, setSelectedFolderIds] = useState<string[]>([])
  const [savedFolders, setSavedFolders] = useState<string[]>([])
  const [isSaved, setIsSaved] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [isCreatingNew, setIsCreatingNew] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")

  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (data) {
      setIsSaved(false)
      setSavedFolders([])
      setSelectedFolderIds([])
      setDropdownOpen(false)
      setIsCreatingNew(false)
      setNewFolderName("")
    }
  }, [data])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [dropdownOpen])

  function speak() {
    if (!data || typeof window === "undefined" || !window.speechSynthesis) return
    const utter = new SpeechSynthesisUtterance(data.recognition.translation)
    utter.lang = languagePair.speechLocale
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utter)
  }

  const toggleFolderSelect = (folderId: string) => {
    setSelectedFolderIds((prev) =>
      prev.includes(folderId) ? prev.filter((id) => id !== folderId) : [...prev, folderId]
    )
  }

  const handleCreateNewFolder = () => {
    if (!newFolderName.trim()) return
    const formattedName = newFolderName.startsWith("#") ? newFolderName.trim() : `#${newFolderName.trim()}`
    const newId = `folder_${Date.now()}`
    const newFolder: FolderItem = { id: newId, name: formattedName }

    setFolders((prev) => [...prev, newFolder])
    setSelectedFolderIds((prev) => [...prev, newId])
    setNewFolderName("")
    setIsCreatingNew(false)
  }

  const handleSaveOrUpdate = () => {
    let finalFolders = [...selectedFolderIds]
    
    // Nếu chưa chọn thư mục nào, tự động cho vào thư mục mặc định mang tên "unsaved"
    if (finalFolders.length === 0) {
      finalFolders = ["unsaved"]
      setSelectedFolderIds(["unsaved"])
    }

    setSavedFolders(finalFolders)
    setIsSaved(true)
  }

  const isModified = isSaved && !areFoldersEqual(selectedFolderIds, savedFolders)

  const selectedDisplayNames = folders
    .filter((f) => selectedFolderIds.includes(f.id))
    .map((f) => f.name)
    .join(", ")

  const recognition = data?.recognition
  const image = data?.image

  return (
    <Dialog open={!!data} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="top-[40%] w-[82%] max-w-xs -translate-y-1/2 rounded-3xl border-neutral-800 bg-neutral-900 p-4 text-neutral-50 sm:max-w-xs">
        {data && recognition && (
          <>
            <DialogHeader className="sr-only">
              <DialogTitle>Kết quả nhận diện từ vựng</DialogTitle>
              <DialogDescription>Chi tiết từ vựng và phiên âm</DialogDescription>
            </DialogHeader>

            <div className="flex gap-3 pt-1">
              {/* thumbnail */}
              <img
                src={image || "/chair-preview.png"}
                alt="Ảnh vừa chụp"
                crossOrigin="anonymous"
                className="size-18 shrink-0 rounded-xl object-cover ring-1 ring-white/10"
              />

              <div className="flex min-w-0 flex-1 flex-col justify-center">
                <div className="flex items-baseline gap-1.5">
                  <h2 className="truncate text-xl font-semibold text-neutral-50">{recognition.source}</h2>
                  <span className="shrink-0 text-xs italic text-neutral-400">({recognition.partOfSpeech})</span>
                </div>

                <div className="mt-0.5 flex items-center gap-1.5">
                  <span className="text-base font-medium text-amber-400">{recognition.translation}</span>
                  <button
                    type="button"
                    onClick={speak}
                    aria-label="Nghe phát âm"
                    className="flex size-7 items-center justify-center rounded-full bg-amber-500/15 text-amber-400 transition-colors hover:bg-amber-500/25 active:scale-95"
                  >
                    <Volume2 className="size-3.5" />
                  </button>
                </div>

                <p className="mt-0.5 font-mono text-xs text-neutral-400">{recognition.ipa}</p>
              </div>
            </div>

            {/* Multi-select Folder Dropdown */}
            <div className="relative mt-4 flex flex-col gap-1" ref={dropdownRef}>
              <label className="text-[11px] font-medium text-neutral-400">Chọn thư mục lưu trữ (Chọn nhiều):</label>
              
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex w-full items-center justify-between rounded-xl border border-neutral-800 bg-neutral-800/80 px-3.5 py-2.5 text-left text-xs text-neutral-200 transition-colors hover:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-amber-400/50"
              >
                <span className={`truncate ${selectedFolderIds.length === 0 ? "text-neutral-500" : "text-neutral-100 font-medium"}`}>
                  {selectedFolderIds.length === 0 ? "Chọn thư mục để lưu..." : selectedDisplayNames}
                </span>
                <ChevronDown className={`size-3.5 shrink-0 text-neutral-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown content */}
              {dropdownOpen && (
                <div className="absolute top-full z-50 mt-1 w-full rounded-xl border border-neutral-800 bg-neutral-900 p-1.5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                  <div className="max-h-40 overflow-y-auto space-y-0.5 pr-1">
                    {folders.map((folder) => {
                      const isChecked = selectedFolderIds.includes(folder.id)
                      return (
                        <button
                          key={folder.id}
                          type="button"
                          onClick={() => toggleFolderSelect(folder.id)}
                          className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs transition-colors ${
                            isChecked
                              ? "bg-amber-500/15 font-medium text-amber-300"
                              : "text-neutral-200 hover:bg-neutral-800"
                          }`}
                        >
                          <span className="truncate">{folder.name}</span>
                          {isChecked && <Check className="size-3.5 shrink-0 text-amber-400" />}
                        </button>
                      )
                    })}
                  </div>

                  <div className="my-1 border-t border-neutral-800" />

                  {/* Create New Folder option */}
                  {isCreatingNew ? (
                    <div className="flex gap-1.5 p-1">
                      <input
                        type="text"
                        placeholder="Tên thư mục..."
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleCreateNewFolder()
                        }}
                        className="flex-1 rounded-lg border border-neutral-700 bg-neutral-800 px-2.5 py-1 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={handleCreateNewFolder}
                        className="rounded-lg bg-amber-400 px-2.5 py-1 text-xs font-semibold text-neutral-900 hover:bg-amber-300"
                      >
                        Tạo
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsCreatingNew(true)}
                      className="flex w-full items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-amber-400 transition-colors hover:bg-amber-500/10"
                    >
                      <FolderPlus className="size-3.5" />
                      + Tạo thư mục mới
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-3.5 flex gap-2.5">
              <button
                type="button"
                onClick={handleSaveOrUpdate}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all active:scale-[0.98] ${
                  !isSaved
                    ? "bg-amber-400 text-neutral-900 hover:bg-amber-300"
                    : isModified
                    ? "bg-amber-500 text-neutral-900 hover:bg-amber-400 ring-2 ring-amber-400/50"
                    : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                }`}
              >
                {!isSaved ? (
                  <>
                    <Bookmark className="size-4" />
                    Lưu vào bộ sưu tập
                  </>
                ) : isModified ? (
                  <>
                    <RefreshCw className="size-4" />
                    Cập nhật
                  </>
                ) : (
                  <>
                    <Check className="size-4" />
                    Đã lưu
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onRetake}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-neutral-800 px-4 py-2.5 text-xs font-semibold text-neutral-100 transition-colors hover:bg-neutral-700 active:scale-[0.98]"
              >
                <RotateCcw className="size-4" />
                Chụp lại
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}



